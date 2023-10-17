<script setup lang="ts">
// @ts-ignore
import { useUserStore } from "../../stores/user";

import { useRolesPermissionsStore } from "../../stores/roles-permissions";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
const {
  getAdmin,
  CreateAdmin,
  deleteAdmin,
  restoreAdmin,
  blockAdmin,
  getSingleAdmin,
  updateAdminDetails,
} = useUserStore();
// @ts-ignore
import { useCountryStore } from "../../stores/country";
const { getAllRoles, assignRole } = useRolesPermissionsStore();
const { roles, assign_role_form, dialog3, isAssigning } = storeToRefs(
  useRolesPermissionsStore()
);
const { admin, loading, dialog, adminDetails, id, dialog2, single_admin } = storeToRefs(
  useUserStore()
);
const form = ref(null);
const { all_country } = storeToRefs(useCountryStore());
const { getAllCountry } = useCountryStore();
// @ts-ignore
// yarn add vue-virtual-scroller@next

import { reactive, onMounted, ref } from "vue";
const header = reactive([
  {
    title: "Id",
  },
  {
    title: "User Info",
  },
  {
    title: "Roles",
  },
  {
    title: "Country",
  },

  {
    title: "Blocked at",
  },

  {
    title: "Date Joined",
  },
  // {
  //   title: "Toggle blocked status",
  // },
  {
    title: "Actions",
  },
]);

const close = () => {
  dialog.value = false;
  adminDetails.value = Object.assign(
    {},
    {
      firstname: "",
      lastname: "",
      email: "",
      country_name: "",
    }
  );
};

onMounted(async () => {
  await getAdmin();
  await getAllRoles();
  await getAllCountry();
});

const blockedStatus = (status: string | null) => {
  return !status ? "Active" : "Blocked";
};
const statusColor = (status: string | null) => {
  return !status ? "green lighten-3" : "red lighten-3";
};

const edit = ref(false);
const btnText = ref("Create Admin");
const editAdmin = async (item: string) => {
  adminDetails.value = Object.assign({}, item);
  btnText.value = "Update admin details";
  dialog.value = true;
  edit.value = true;
};

const user_id = ref("");
const openAssignRole = async (item: string) => {
  dialog3.value = true;
  user_id.value = item;
};
const closeDialog3 = () => {
  dialog3.value = false;
  assign_role_form.value.role_id = "";
};

const updateRole = async () => {
  await assignRole(user_id.value, assign_role_form.value);
};

const valid = ref(null);

const getRoles = (item: Array<object>) => {
  const roles = item.map((element: any) => {
    return element.name;
  });

  return String(roles);
};
</script>

<template>
  <div>
    <v-card class="pa-3" rounded="0">
      <div class="d-flex align-center justify-space-between">
        <h3>All Admins</h3>
        <v-btn @click="dialog = true" prepend-icon="mdi-account-plus" color="secondary"
          >Create Admin</v-btn
        >
      </div>

      <v-table class="my-5">
        <thead>
          <tr>
            <td class="font-weight-bold" v-for="(Ttitle, index) in header" :key="index">
              {{ Ttitle.title }}
            </td>
          </tr>
        </thead>

        <tbody v-if="admin?.length > 0 && loading === false">
          <tr v-for="(items, index) in admin" :key="index">
            <td># {{ index + 1 }}</td>
            <td>
              <div class="d-flex align-center">
                <div>
                  <v-img
                    width="45px"
                    :src="items?.avatar ?? 'https://via.placeholder.com/15'"
                    class="rounded-circle"
                  >
                  </v-img>
                </div>
                <div class="ml-2">
                  <span class="font-weight-bold"> {{ items?.firstname }}</span>
                  <span class="ml-1 font-weight-bold"> {{ items?.lastname }}</span>
                  <p>{{ items?.email ?? "No data" }}</p>
                </div>
              </div>
            </td>

            <td>
              {{ getRoles(items?.roles) }}
            </td>
            <td>
              {{ items?.country?.name ?? "No data" }}
            </td>

            <td>
              <v-chip label class="pa-2" :color="statusColor(items?.blocked_at)">
                {{ blockedStatus(items?.blocked_at) }}
              </v-chip>
            </td>
            <td>
              {{ useDateFormat(items?.created_at, "DD, MMMM-YYYY").value ?? "No data" }}
            </td>
            <!-- <td>
              <v-switch @input="restoreAdmin(items?.id)"></v-switch>
            </td>
            <td>
              <v-switch @input="activationAdmin(items?.id)"></v-switch>
            </td> -->
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
                      @click="getSingleAdmin(items?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> View Details </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="editAdmin(items)" link color="secondary">
                      <v-list-item-title> Update admin </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="openAssignRole(items?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Assign role </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteAdmin(items?.id)" link color="secondary">
                      <v-list-item-title> Delete admin </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>

        <tr v-else-if="loading === false && admin?.length <= 0" class="mt-7">
          <td colspan="8" class="text-center">No data found</td>
        </tr>
      </v-table>
      <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550px">
        <v-card>
          <v-card-title class="py-4">
            <h3 class="text-h5 font-weight-bold">{{ btnText }}</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="adminDetails.firstname"
                      label="First name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="adminDetails.lastname"
                      label="Last name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="adminDetails.email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-autocomplete
                      :items="all_country"
                      label="Countries"
                      no-filter
                      required
                      item-title="name"
                      item-value="id"
                      v-model="adminDetails.country"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" class="px-7" variant="outlined" @click="close">
              Close
            </v-btn>
            <v-btn
              :loading="loading"
              @click="
                edit == false ? CreateAdmin() : updateAdminDetails(adminDetails?.id)
              "
              color="secondary"
              class="px-12"
              variant="flat"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="500px">
        <v-card>
          <v-card-title class="py-4">
            <h3 class="text-h5 font-weight-bold">Admin Details</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <div class="d-flex align-center justify-center w-100 my-5">
                <div class="d-flex align-center justify-center flex-column w-100">
                  <v-avatar color="secondary" :size="80" class="my-4 position-relative">
                    <v-img
                      cover
                      v-if="single_admin.avatar !== null"
                      :src="single_admin.avatar"
                    ></v-img>
                    <span v-else class="text-h5 text-uppercase">{{
                      single_admin.email.slice(0, 2)
                    }}</span>
                  </v-avatar>

                  <h3>{{ single_admin.firstname }} {{ single_admin.lastname }}</h3>

                  <div class="text-center">
                    <p>{{ single_admin.email }}</p>
                    <p class="font-weight-bold mt-2">
                      Phone:
                      <span class="font-weight-light">{{
                        single_admin.phone_number ?? "No data"
                      }}</span>
                    </p>
                    <p class="font-weight-bold mt-2">
                      Status:
                      <v-chip
                        label
                        class="pa-2"
                        :color="statusColor(single_admin?.blocked_at)"
                      >
                        {{ blockedStatus(single_admin?.blocked_at) }}
                      </v-chip>
                    </p>

                    <div class="mt-6 d-flex align-center flex-column w-100">
                      <!-- <v-switch
                        color="secondary"
                        hide-details
                        inset
                        @input="restoreAdmin(single_admin?.id)"
                        :label="'Restore Admin'"
                      ></v-switch> -->
                      <v-switch
                        color="secondary"
                        hide-details
                        inset
                        class="ml-4"
                        @input="blockAdmin(single_admin?.id)"
                        :label="'Toggle Blocked Status'"
                      ></v-switch>
                    </div>

                    <div class="mt-5">
                      <p class="font-weight-bold mb-2">Giftcard categories:</p>
                      <v-chip
                        color="secondary"
                        class="ml-2 mb-2"
                        v-for="category in single_admin.giftcard_categories"
                        :key="category.id"
                        >{{ category.name }}</v-chip
                      >
                      <p v-if="single_admin.giftcard_categories?.length < 0">Admin has not been assigned to any giftcard category</p>
                    </div>
                    <div class="mt-5">
                      <p class="font-weight-bold mb-2">Roles:</p>
                      <v-chip
                        color="secondary"
                        class="ml-2 mb-2"
                        v-for="role in single_admin.roles"
                        :key="role.id"
                        >{{ role.name }}</v-chip
                      >
                      <p v-if="single_admin.roles?.length < 0">Admin has not been assigned to any role</p>
                    </div>
                  </div>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              class="px-7"
              variant="outlined"
              @click="dialog2 = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog3" persistent max-width="500px">
        <v-card>
          <v-card-title class="py-4">
            <h3 class="text-h5 font-weight-bold">Assign Role</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <div class="d-flex align-center justify-center w-100 my-5">
                <v-autocomplete
                  :items="roles"
                  label="Roles"
                  required
                  item-title="name"
                  item-value="id"
                  v-model="assign_role_form.role_id"
                ></v-autocomplete>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              class="px-7"
              variant="outlined"
              @click="closeDialog3"
            >
              Close
            </v-btn>
            <v-btn
              :loading="isAssigning"
              color="secondary"
              class="px-12"
              variant="flat"
              @click="updateRole"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
