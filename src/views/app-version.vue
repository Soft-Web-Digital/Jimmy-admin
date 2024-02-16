<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useNetworksStore } from "../stores/networks";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const { getAppVersionData, editSystemData } = useNetworksStore();
const { app_version, loading, dialog, dialog2, content } = storeToRefs(
  useNetworksStore()
);

onMounted(async () => {
  await getAppVersionData();
});

const page_title = ref({ title: "App Version" });
const title = ref("");
const header = ref([
  {
    title: "Id",
  },
  {
    title: "Content",
  },
  {
    title: "Title",
  },
  {
    title: "Hint",
  },
  {
    title: "Date created",
  },
  {
    title: "Actions",
  },
]);

// CHANGE STATUS COLOR
type StatusType = "pending" | "completed" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow lighten-3"
    : status == "completed"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//
// VIEW WITHDRAWAL
// const dialog = ref(false);
// const fetching = ref(false);
// const viewWithDrawalRequest = async (id: string) => {
//   dialog.value = true;
//   fetching.value = true;
//   await getSingleWithDrawals(id);
//   fetching.value = false;
// };

// const page = ref(21);

const edit = ref(false);
const Id = ref("");
const btnText = ref("Create Item");
const editItem = (item: string, id: string) => {
  Id.value = id;
  content.value = item;
  btnText.value = "Update Item";
  dialog2.value = true;
  edit.value = true;
};
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Height -->
  <!-- ----------------------------------------------------------------------------- -->
  <!-- <v-data-table></v-data-table> -->
  <div>
    <BaseBreadcrumb :title="page_title.title"></BaseBreadcrumb>
    <div class="mt-4">
      <v-card class="pa-5">
        <v-table>
          <thead>
            <tr>
              <th
                v-for="(headings, index) in header"
                :key="index"
                class="text-left font-weight-bold"
              >
                {{ headings.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="loading == false">
            <tr class="pa-3" v-for="(data, index) in app_version" :key="data?.id">
              <td>{{ index + 1 }}</td>
              <td>{{ data?.content }}</td>
              <td>{{ data?.hint }}</td>
              <td>{{ data?.title }}</td>
              <td>
                {{ useDateFormat(data?.created_at, "DD, MMMM-YYYY").value }}
              </td>

              <td>
                <v-row justify="center">
                  <v-menu transition="scroll-y-transition">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        text
                        icon="mdi-dots-vertical"
                        color="transparent"
                        class="ma-2"
                        v-bind="props"
                      >
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="
                          editItem(data?.content, data?.id);
                          title = data?.title;
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Update Request </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
      <!-- <v-pagination
        v-model="page"
        :length="4"
        active-color="grey-darken-4"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination> -->
    </div>



    <v-dialog v-model="dialog2" max-width="500px">
      <v-card class="pa-4">
        <h3>Update {{ title }}</h3>
        <v-form class="mt-8 py-8">
          <v-text-field
            v-model="content"
            label="content"
            type="text"
            variant="outlined"
          ></v-text-field>
          <v-btn
            @click="editSystemData({ content:content , id: Id })"
            color="primary"
            block
            :loading="loading"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
