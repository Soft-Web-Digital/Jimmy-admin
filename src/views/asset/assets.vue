<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAssetStore } from "../../stores/asset";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import useFormatter from "@/composables/useFormatter";
const { sortItems } = useFormatter();

const {
  getAllAsset,
  deleteAsset,
  createAssets,
  restoreAsset,
  updateAssets,
  getAllNetworks,
  getSingleAsset,
} = useAssetStore();
const {
  allTransactions,
  loading,
  dialog,
  asset,
  assets,
  all_networks,
  dialog2,
  asset_details,
} = storeToRefs(useAssetStore());

const header = ref([
  {
    title: "No.",
  },
  {
    title: "Icon",
  },
  {
    title: "Asset name",
  },
  {
    title: "Code",
  },

  {
    title: "Buy rate",
  },
  {
    title: "Sell rate",
  },
  {
    title: "Created At",
  },
  {
    title: "Actions",
  },
]);
const name = ref("");
const code = ref("");
const page = ref(1);

const close = () => {
  dialog.value = false;
  asset.value = Object.assign(
    {},
    {
      name: "",
      code: "",
      icon: "",
      buy_rate: "",
      sell_rate: "",
      id: "",
      networks: [],
      buy_min_amount: "",
      buy_max_amount: "",
      sell_min_amount: "",
      sell_max_amount: "",
    }
  );
  btnText.value = "Create Item";
  edit.value = false;
};

onMounted(async () => {
  await getAllAsset(page.value, name.value, code.value);
  await getAllNetworks();
});

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

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

const get_selected_file = (e: any) => {
  asset.value.icon = e.target.files[0];
};

const openlink = (url: string) => {
  window.open(url);
  // console.log(url)
};

// Edit asset workflow
const edit = ref(false);
const btnText = ref("Create Asset");
const dialogTitle = ref("Create new asset");

const editItem = (item: any) => {
  asset.value = {
    name: item.name,
    code: item.code,
    icon: item.icon,
    buy_rate: item.buy_rate,
    sell_rate: item.sell_rate,
    id: item.id,
    networks: item.networks,
    network_id: item.networks.map((item: any) => item.id),
    buy_min_amount: item.buy_min_amount,
    buy_max_amount: item.buy_max_amount,
    sell_min_amount: item.sell_min_amount,
    sell_max_amount: item.sell_max_amount,
  };
  btnText.value = "Update Asset";
  dialogTitle.value = "Edit asset";
  dialog.value = true;
  edit.value = true;
};

const closeDialog = () => {
  asset.value = {
    name: "",
    code: "",
    icon: "",
    buy_rate: "",
    sell_rate: "",
    id: "",
    networks: [],
    network_id: [],

    buy_min_amount: "",
    buy_max_amount: "",
    sell_min_amount: "",
    sell_max_amount: "",
  };
  edit.value = false;
  btnText.value = "Create Asset";
  dialogTitle.value = "Create new asset";
};

watch(dialog, () => {
  if (!dialog.value) {
    setTimeout(() => {
      closeDialog();
    }, 500);
  }
});
const filter_type = [
  {
    text: "All Assets",
    value: "with",
  },
  {
    text: "Deleted Assets",
    value: "only",
  },
];
const filter = ref("with");

const filterByDeleted = (filter: string) => {
  if (filter == "with") {
    getAllAsset(page.value, name.value, code.value);
  } else {
    getAllAsset(page.value, name.value, code.value, "only");
  }
};
watch(filter, (newValue) => {
  filterByDeleted(newValue);
});
const restoreItem = async (id: string) => {
  await restoreAsset(id);
  filter.value = "with";
};
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <div class="w-full d-md-flex justify-space-between my-3">
        <h2>Assets</h2>
        <div class="d-md-flex align-center">
          <v-select
            v-model="filter"
            class="select-field"
            label="Filter by type"
            density="compact"
            :items="filter_type"
            item-title="text"
            item-value="value"
            variant="outlined"
          ></v-select>
          <v-btn
            prepend-icon="mdi-plus"
            @click="dialog = true"
            variant="flat"
            color="secondary"
            class="ml-3"
          >
            Create New Asset
          </v-btn>
        </div>
      </div>
      <v-card class="pa-5">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              variant="outlined"
              label="Asset name*"
              v-model="name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              variant="outlined"
              label="Asset code*"
              v-model="code"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn
              @click="name !== '' || code !== '' ? getAllAsset(page, name, code) : null"
              color="secondary"
              block
              >Search</v-btn
            >
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
          <tbody v-if="assets?.data?.length > 0 && loading == false">
            <tr v-for="(item, index) in sortItems(assets.data)" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <v-avatar size="50px">
                  <v-img
                    cover
                    class="rounded-circle img-fluid img-size"
                    :src="item?.icon"
                  ></v-img>
                </v-avatar>
              </td>
              <td :class="{ 'font-weight-bold': item.account_name == null }">
                {{ item.name ?? "No name" }}
              </td>
              <td>{{ item.code }}</td>
              <td>₦‎{{ item.buy_rate }}</td>
              <td>₦‎{{ item.sell_rate }}</td>
              <td>
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY hh:mm a").value }}
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
                      <!-- <v-list-item @click="editItem(item)" link color="secondary">
                        <v-list-item-title> Update Asset </v-list-item-title>
                      </v-list-item> -->
                      <v-list-item
                        @click="
                          dialog2 = true;
                          getSingleAsset(item?.id);
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Asset </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="editItem(item)" link color="secondary">
                        <v-list-item-title> Edit Asset </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-show="filter === 'only'"
                        @click="restoreItem(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Restore Asset </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteAsset(item?.id)" link color="secondary">
                        <v-list-item-title> Delete Asset </v-list-item-title>
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
          v-if="assets?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>

        <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>

      <v-pagination
        v-model="page"
        :length="assets.last_page"
        @next="getAllAsset(page, name, code)"
        @prev="getAllAsset(page, name, code)"
        @update:modelValue="getAllAsset(page, name, code)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-row justify="center">
      <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card :loading="loading">
          <h3 class="text-h5 font-weight-bold pa-7">{{ btnText }}</h3>
          <v-card-text>
            <v-container>
              <v-form @submit.prevent="edit ? updateAssets(asset) : createAssets(asset)">
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="asset.name"
                      variant="outlined"
                      label="Asset name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="asset.code"
                      variant="outlined"
                      label="Asset Short Code*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      variant="outlined"
                      label="Asset Icon*"
                      required
                      @change="get_selected_file"
                      prepend-icon=""
                      append-inner-icon="mdi-paperclip"
                    ></v-file-input>
                    <v-btn
                      size="small"
                      link
                      @click="openlink(asset.icon)"
                      class="cursor-pointer"
                      label
                      color="secondary"
                      v-if="edit == true"
                      >View current icon</v-btn
                    >
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.buy_rate"
                      variant="outlined"
                      label="Buy Rate*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.sell_rate"
                      variant="outlined"
                      label="Sell Rate*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.buy_min_amount"
                      variant="outlined"
                      label="Buy min amount*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.buy_max_amount"
                      variant="outlined"
                      label="Buy max amount*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.sell_min_amount"
                      variant="outlined"
                      label="Sell min amount*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.sell_max_amount"
                      variant="outlined"
                      label="Sell max amount*"
                      required
                      type="number"
                      @update:modelValue="() => formatCurrency(asset.sell_max_amount)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      :items="all_networks"
                      multiple
                      chips
                      v-model="asset.networks"
                      label="Select Networks"
                      required
                    >
                    </v-select>
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
                    :disabled="
                      !asset.name ||
                      !asset.code ||
                      !asset.buy_rate ||
                      !asset.sell_rate ||
                      !asset.network_id ||
                      !asset.icon ||
                      !asset.buy_min_amount ||
                      !asset.buy_max_amount ||
                      !asset.sell_min_amount ||
                      !asset.sell_max_amount
                    "
                    :loading="loading"
                    variant="flat"
                    @click="edit === true ? updateAssets(asset) : createAssets(asset)"
                  >
                    Submit
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
          <h3 class="text-center my-4">Asset Details</h3>
          <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <v-container v-else class="fill-height">
            <div class="d-flex flex-column">
              <div class="d-flex align-center justify-space-between w-full">
                <div>
                  <h4 class="text-grey font-weight-light">Name</h4>
                  <div class="d-flex align-center">
                    <v-avatar size="50px">
                      <v-img
                        class="img-fluid rounded-circle img-size"
                        cover
                        :src="asset_details?.icon"
                      ></v-img>
                    </v-avatar>
                    <p class="ml-3 font-weight-bold">
                      {{ asset_details.name }}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 class="text-grey font-weight-light">Code</h4>
                  <p class="my-3 font-weight-bold">{{ asset_details.code }}</p>
                </div>
                <div>
                  <h4 class="text-grey font-weight-light">Buy Rate</h4>
                  <p class="my-3 font-weight-bold">
                    {{ asset_details.buy_rate }}
                  </p>
                </div>
                <div>
                  <h4 class="text-grey grey-darken-4 font-weight-light">Sell Rate</h4>
                  <p class="my-3 font-weight-bold">
                    {{ asset_details.sell_rate }}
                  </p>
                </div>
              </div>
              <div v-if="asset_details?.networks?.length > 0" class="mt-8">
                <h3 class="text-grey font-weight-bold">
                  Network(s) that belong to this asset:
                </h3>

                <v-row class="">
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="network in asset_details?.networks"
                    :key="network?.id"
                  >
                    <div class="mb-2">
                      <h4 class="mb-1 text-grey font-weight-light">Name</h4>
                      <p class="font-weight-bold">{{ network.name }}</p>
                    </div>
                    <div class="mb-2">
                      <h4 class="mb-1 text-grey font-weight-light">Wallet address</h4>
                      <p class="font-weight-bold">
                        {{ network.wallet_address }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <p v-else class="text-center py-5">This asset has no related network</p>
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

.text-grey {
  color: #afafaf;
}

:deep(.v-text-field .v-input__details) {
  display: none !important;
}
</style>
