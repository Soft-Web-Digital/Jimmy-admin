<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAssetStore } from "../stores/asset";
import { useNetworksStore } from "../stores/networks";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";

const {
  getAllNetwork,
  createNetworks,
  editNetworks,
  deleteNetworks,
  restoreNetworks,
  getSingleNetwork,
} = useNetworksStore();
const { networks, loading, dialog, network, dialog2, single_network } = storeToRefs(
  useNetworksStore()
);
const header = ref([
  {
    title: "No.",
  },
  {
    title: "Name",
  },
  {
    title: "Wallet address",
  },
  {
    title: "Asset count",
  },
  {
    title: "Created at",
  },
  {
    title: "Actions",
  },
]);

const page = ref(1);
onMounted(async () => {
  await getAllNetwork(page.value, name.value);
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "transferred" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow lighten-3"
    : status == "transferred"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//

const edit = ref(false);
const btnText = ref("Create Network");
const editItem = (item: never) => {
  network.value = Object.assign({}, item);
  btnText.value = "Update Network";
  dialog.value = true;
  edit.value = true;
};
const close = (item: never) => {
  network.value = Object.assign(
    {},
    {
      name: "",
      wallet_address: "",
    }
  );
  btnText.value = "Create Network";
  dialog.value = false;
  edit.value = false;
};
const name = ref("");

const searching = ref(false)
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <div class="w-full d-flex justify-space-between my-3">
        <h2>Networks</h2>
        <v-btn
          prepend-icon="mdi-plus"
          @click="dialog = true"
          variant="flat"
          color="secondary"
        >
          Create New Network
        </v-btn>
      </div>
      <v-card class="pa-5">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              variant="outlined"
              label="Network name*"
              v-model="name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn @click=" name !== '' ? getAllNetwork(page, name): null" :loading="searching" color="secondary" block>Search</v-btn>
          </v-col>
        </v-row>
        <v-table>
          <thead>
            <tr>
              <th v-for="(headings, index) in header" :key="index" class="text-left">
                {{ headings.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="networks?.data?.length > 0 && loading == false">
            <tr v-for="(item, index) in networks.data" :key="item.id">
              <td>{{ index + 1 }}</td>

              <td :class="{ 'font-weight-bold': item.account_name == null }">
                {{ item.name ?? "No name" }}
              </td>

              <td>{{ item.wallet_address }}</td>
              <td>{{ item.assets_count }}</td>

              <td>
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
              </td>

              <td>
                <v-row justify="center">
                  <v-menu transition="scroll-x-transition">
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
                          dialog2 = true;
                          getSingleNetwork(item?.id);
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Network </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="editItem(item)" link color="secondary">
                        <v-list-item-title> Edit Network </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="restoreNetworks(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Restore Network </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="deleteNetworks(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Delete Network </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>

        <p
          class="font-weight-bold text-center my-3"
          v-if="networks?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>

        <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
      <v-pagination
        v-model="page_no"
        :length="networks.last_page"
        @next="getAllNetwork(page, name)"
        @prev="getAllNetwork(page, name)"
        @update:modelValue="getAllNetwork(page, name)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card :loading="loading">
          <h3 class="text-h5 font-weight-bold pa-7">{{ btnText }}</h3>
          <v-card-text>
            <v-container>
              <v-form>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="network.name"
                      variant="outlined"
                      label="Network name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-textarea
                      v-model="network.wallet_address"
                      variant="outlined"
                      label="Withdrawal address*"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" class="px-7" variant="outlined" @click="close">
                    Close
                  </v-btn>
                  <v-btn
                    color="secondary"
                    class="px-12"
                    @click="
                      edit == true ? editNetworks(network) : createNetworks(network)
                    "
                    :loading="loading"
                    variant="flat"
                  >
                    {{ btnText }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <h3 class="text-center my-4">Network Details</h3>
          <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <v-container v-else class="fill-height">
            <div class="d-flex flex-column">
              <div class="d-flex flex-column w-full">
                <div>
                  <h4 class="text-grey font-weight-light">Name</h4>
                  <p class="my-1 font-weight-bold">
                    {{ single_network?.name }}
                  </p>
                </div>

                <div class="my-1">
                  <h4 class="text-grey font-weight-light">Wallet address</h4>
                  <p class="my-1 font-weight-bold">
                    {{ single_network?.wallet_address }}
                  </p>
                </div>
              </div>
              <div v-if="single_network?.assets?.length > 0" class="mt-8">
                <h3 class="text-grey font-weight-bold">
                  Asset(s) that belong to this Network:
                </h3>

                <v-row class="my-1">
                  <v-col
                    cols="12"
                    sm="12"
                    v-for="asset in single_network?.assets"
                    :key="asset?.id"
                    class="py-0 my-2"
                  >
                    <div
                      class="d-flex align-center justify-space-between flex-wrap w-full"
                    >
                      <div>
                        <h4 class="text-grey font-weight-light">Name</h4>
                        <div class="d-flex align-center">
                          <v-avatar size="50px">
                            <v-img
                              class="img-fluid rounded-circle img-size"
                              cover
                              :src="asset?.icon"
                            ></v-img>
                          </v-avatar>
                          <p class="ml-3 font-weight-bold">{{ asset.name }}</p>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-grey font-weight-light">Code</h4>
                        <p class="my-3 font-weight-bold">{{ asset.code }}</p>
                      </div>
                      <div>
                        <h4 class="text-grey font-weight-light">Buy Rate</h4>
                        <p class="my-3 font-weight-bold">
                          {{ asset.buy_rate }}
                        </p>
                      </div>
                      <div>
                        <h4 class="text-grey grey-darken-4 font-weight-light">
                          Sell Rate
                        </h4>
                        <p class="my-3 font-weight-bold">
                          {{ asset.sell_rate }}
                        </p>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <p v-else class="text-center py-5">This network has no related asset</p>
            </div>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
