<script setup lang="ts">
import { ref, watch, onMounted, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useCountryStore } from "../../../stores/country";
import { useAuthStore } from "../../../stores/auth";

import { useCustomizerStore } from "@/stores/customizer";
import sidebarItems from "./sidebarItem";
import LogoLight from "../logo/LogoLight.vue";
import LogoDark from "../logo/LogoDark.vue";

const customizer = useCustomizerStore();
const { getCountries, getCurrency, getProducts } = useCountryStore();
const { getNotifications,getPermissions } = useAuthStore();

// All permissions
const { all_permissions, all_permissions_group } = storeToRefs(useAuthStore());


const unique_groups = ref<any>('')


// checkPermissions({permission: 'Manage_giftcards'})

const sidebarMenu = ref(sidebarItems);



onBeforeMount(async () => {
  await getPermissions()

  unique_groups.value = [...new Set(all_permissions_group.value)];
});
onMounted(async () => {
  await getCountries();
  await getCurrency();
  await getProducts();
  await getNotifications();
});
</script>

<template>
  <v-navigation-drawer
    left
    :permanent="$vuetify.display.mdAndUp"
    v-model="customizer.Sidebar_drawer"
    elevation="10"
    :class="customizer.SidebarColor == 'white' ? '' : 'text-white'"
    :color="customizer.darktheme ? '' : customizer.SidebarColor"
    rail-width="75"
    mobile-breakpoint="960"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4">
      <LogoDark
        v-if="!customizer.darktheme && customizer.SidebarColor == 'white'"
      />
      <LogoLight v-else />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list v-if="unique_groups.length > 0  && all_permissions.length > 0 " class="pa-4" color="#34384f">
        <!-- ---------------------------------------------- -->
        <!---Menu Loop -->
        <!-- ---------------------------------------------- -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <v-list-subheader
            class="font-weight-bold black--text"
            v-if="item.group_name == '' || unique_groups.includes(item?.group_name) && item.header "
            >{{ item.header }}</v-list-subheader
          >

          <v-list-group
            v-else-if="item.children && unique_groups.includes(item?.group_name)"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :value="item.title"
                rounded="lg"
                class="mb-1"
              >
                <!---Icon  -->
                <template v-slot:prepend>
                  <vue-feather
                    :type="item.icon"
                    class="feather-sm v-icon"
                  ></vue-feather>
                </template>
                <!---Title  -->
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item>
            </template>

            <template v-for="(subitem, i) in item.children" :key="i">
              <v-list-item
                :value="subitem.to"
                :to="subitem.to"
                rounded="lg"
                v-if="all_permissions.includes(subitem?.permissions)"
                color="#34384f"
                class="first-level-item mb-1"
              >
                <template v-slot:prepend>
                  <vue-feather
                    v-if="all_permissions.includes(subitem?.permissions)"
                    type="disc"
                    class="feather-sm v-icon"
                  ></vue-feather>
                </template>
                <v-list-item-title
                  v-if="all_permissions.includes(subitem?.permissions)"
                  v-text="subitem.title"
                ></v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>

          <template v-else>
            <v-list-item
              v-if="
                all_permissions.includes(item?.permissions) ||
                item?.permissions == '' && all_permissions.length == 18
              "
              :key="i"
              :to="item.to"
              rounded="lg"
              class="mb-1"
            >
              <template v-slot:prepend>
                <vue-feather
                  :type="item.icon"
                  class="feather-sm v-icon v-icon--size-default"
                ></vue-feather>
              </template>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style>
.text-h5 {
  font-family: "DM Sans", sans-serif !important;
}
.v-list-item-title {
  font-size: 13px;
}

p {
  font-size: 13px;
}
</style>
