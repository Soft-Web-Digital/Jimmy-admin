<script setup lang="ts">
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref, reactive } from "vue";
import { useDateFormat } from "@vueuse/core";
const { bank_info, loading, dialog2, banks } = storeToRefs(useUserStore());

const {
  getSystemBanks,
  getBanks,
  createSystemBanks,
  updateSystemBanks,
  deleteSystemBanks,
} = useUserStore();

const page = ref(1);
const id = ref("");
const edit = ref(false);
let form_field = ref({
  bank_name: "",
  account_number: "",
  account_name: "",
});

const edit_item = (item: never) => {
  form_field.value = Object.assign({}, item);
  edit.value = true;
};
const close = (value: boolean) => {
  form_field.value = Object.assign(
    {},
    {
      bank_name: "",
      account_number: "",
      account_name: "",
    }
  );
  edit.value = value;
};

const headings = [
  // {
  //   bank_name: "Zenith",
  //   account_name: "Alysson Blanda",
  //   account_number: "0000000000",
  //   created_at: "2023-04-06T05:51:29.000000Z",
  // },
  {
    title: "No.",
  },

  {
    title: "Bank name",
  },
  {
    title: "Account name",
  },
  {
    title: "Account number",
  },
  {
    title: "Date created",
  },
  {
    title: "Last updated",
  },
  {
    title: "Actions",
  },
];

onMounted(async () => {
  await getSystemBanks(page.value);
  await getBanks();
});
</script>

<template>
  <div>
    <h2 class="my-5">System bank accounts</h2>
    <div class="d-flex align-center justify-end mb-4">
      <v-btn @click="dialog2 = true" color="secondary">Add a system bank</v-btn>
    </div>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th
              v-for="(heading, index) in headings"
              :key="index"
              class="text-left font-weight-bold"
            >
              {{ heading.title }}
            </th>
          </tr>
        </thead>

        <tbody v-if="bank_info?.system_bank_accounts?.length > 0 && loading == false">
          <tr
            class="pa-1"
            :key="index"
            v-for="(banks, index) in bank_info.system_bank_accounts"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ banks.account_name }}</td>
            <td>{{ banks.account_number }}</td>
            <td>{{ banks.bank_name }}</td>
            <td>
              {{ useDateFormat(banks?.created_at, "DD, MMM YYYY - hh:mm a").value }}
            </td>
            <td>
              {{ useDateFormat(banks?.updated_at, "DD, MMM YYYY - hh:mm a").value }}
            </td>
            <td>
              <!-- <v-icon icon="mdi-dots-vertical"></v-icon> -->
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
                        edit_item(banks), (dialog2 = true);
                        id = banks.id;
                      "
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Update Details </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="deleteSystemBanks(banks.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Delete Bank </v-list-item-title>
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
      <p
        class="text-center font-weight-bold mb-4 py-5"
        v-if="bank_info?.system_bank_accounts?.length <= 0 && loading == false"
      >
        No data available
      </p>
    </v-card>

    <v-pagination
      v-model="page"
      :length="bank_info?.last_page"
      @next="getSystemBanks(page)"
      @prev="getSystemBanks(page)"
      @update:modelValue="getSystemBanks(page)"
      active-color="red"
      :start="1"
      variant="flat"
      class="mt-5"
      color="bg-secondary"
      rounded="circle"
    ></v-pagination>

    <v-dialog @update:modelValue="close" v-model="dialog2" max-width="500px">
      <v-card class="pa-4">
        <h3>{{ edit ? "Update bank details" : "Add a bank" }}</h3>
        <v-form class="mt-8 py-8">
          <v-select
            v-model="form_field.bank_name"
            label="Select a bank"
            item-value="name"
            item-title="name"
            variant="outlined"
            :items="banks"
          ></v-select>
          <v-text-field
            type="number"
            v-model="form_field.account_number"
            label="Account number"
            :rules="[
              (v) => (v && v.length === 10) || 'Account number must be 10 characters',
            ]"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            type="text"
            v-model="form_field.account_name"
            label="Account name"
            variant="outlined"
          ></v-text-field>
          <v-btn
            @click.stop="
              edit == true
                ? updateSystemBanks({ ...form_field, id })
                : createSystemBanks(form_field)
            "
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

<style scoped></style>
