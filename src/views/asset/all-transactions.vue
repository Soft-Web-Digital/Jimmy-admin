<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, watch } from "vue";
import { useAssetStore } from "../../stores/asset";
import { useUserStore } from "../../stores/user";
import uploadImage from "@/composables/uploadImage";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { watchDebounced } from "@vueuse/core";
// import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";

import { useWithdrawalsStore } from "../../stores/withdrawals";

const { getAllTransactionCount } = useWithdrawalsStore();

const { asset_total } = storeToRefs(useWithdrawalsStore());
const { permissions } = storeToRefs(useAuthStore());

const {
  getAllAssetTransactions,
  approveAssetTransactions,
  declineAssetTransactions,
  getSingleAssetTransactions,
  getAllAssetTransactionByTradeType,
  getAllAssetTransactionsStatus,
  getAllAssetTransactionByReference,
  getAllAssetTransactionByDate,
  partialApproveRequest,
} = useAssetStore();

let uploadingImage = ref<boolean>(false);
let startImage = ref<number>(1);
let totalImage = ref<number>(1);
// const { getAllUsers } = useUserStore();
const partial_approve = reactive({
  review_amount: "",
  review_note: "",
  review_proof: <any>[],
});
const previewList = ref<any>([]);
const removeImage = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  partial_approve.review_proof.splice(index, 1);
};
const partial = ($event: any) => {
  uploadingImage.value = true;
  let count = $event.length;
  let index = 0;
  if (event) {
    totalImage.value = $event.length;
    while (count--) {
      uploadImage($event[index]).then((response) => {
        startImage.value++;
        previewList.value.push(response.secure_url);
        partial_approve.review_proof.push(response.secure_url);
      });
      index++;
    }
    startImage.value = 0;
  }
};
const {
  allTransactions,
  loading,
  dialog,
  dialog2,
  single_transactions,
  page,
  tab,
  status,
} = storeToRefs(useAssetStore());
// const page = ref(1);

const header = ref([
  {
    title: "No.",
  },
  {
    title: "Full name",
  },
  {
    title: "Reference No.",
  },

  {
    title: "Amount",
  },
  {
    title: "Date",
  },
  {
    title: "Trade Type",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

const search = ref("");
const type = ref("");
const date = ref("");
const date2 = ref("");
const search_by_reference = () => {
  watchDebounced(
    search,
    async () => {
      await getAllAssetTransactionByReference(search.value);
    },
    { debounce: 1000, maxWait: 5000 }
  );
};

// Define the function that will be called every 2 minutes
const fetchData = async () => {
  await getAllTransactionCount();
  await getAllAssetTransactions(
    status.value,
    page.value,
    type.value,
    search.value,
    date.value,
    date2.value
  );
};

// Set up the interval on mount
let intervalId = ref<any>(null);
onMounted(() => {
  fetchData();
  intervalId.value = setInterval(fetchData, 120000); // 120000 milliseconds = 2 minutes
});

// Clear the interval on unmount
onUnmounted(() => {
  clearInterval(intervalId.value);
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "approved" | "declined" | "partially_approved";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "approved"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : status == "partially_approved"
    ? "purple lighten-3"
    : "";
};
//

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

// const open_file = (file: string) => {
//   window.open(file);
// }

const note = ref("");
const id = ref("");

const reproof = ref("");
const get_reproof = (e: any) => {
  reproof.value = e.target.files[0];
};

const formate_text = (text: string) => {
  if (text === "partially_approved") return "Partial";
  return text;
};

const reset = async () => {
  (status.value = ""),
    (page.value = 1),
    (type.value = ""),
    (search.value = ""),
    (date.value = ""),
    (date2.value = "");
  await getAllAssetTransactions(
    status.value,
    page.value,
    type.value,
    search.value,
    date.value,
    date2.value
  );
};

const refresh = async () => {
  await getAllAssetTransactions(
    status.value,
    page.value,
    type.value,
    search.value,
    date.value,
    date2.value
  );
};

const confirmationDialog = ref(false);
let confirmationID = ref("");
const confirmationStatus = ref("");
const openConfirmationDialog = (type: string, id?: any) => {
  confirmationDialog.value = true;
  confirmationID.value = id;
  confirmationStatus.value = type;
};
const makeConfirmation = async (type: string) => {
  if (type == "approve") {
    await approveAssetTransactions(confirmationID.value);
    refresh();
    confirmationDialog.value = false;
  } else if (type == "decline") {
    declineAssetTransactions(confirmationID.value);
    confirmationDialog.value = false;
  } else if (type == "partial") {
    partialApproveRequest(confirmationID.value, partial_approve);
    confirmationDialog.value = false;
  }
  confirmationDialog.value = false;
};

watch([dialog, dialog2], ([newDialog, oldDialog], [newDialog2, oldDialog2]) => {
  newDialog === false && oldDialog === false ? refresh() : "";
});
</script>

<template>
  <v-dialog v-model="confirmationDialog" width="500">
    <v-card>
      <v-toolbar dark dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
          Confirm
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4 black--text"
        >Are you sure you want to
        {{
          confirmationStatus === "partial"
            ? "partially approve"
            : confirmationStatus
        }}
        this transaction?</v-card-text
      >
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="confirmationDialog = false"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          class="body-2 font-weight-bold"
          outlined
          @click.native="makeConfirmation(confirmationStatus)"
          >Yes</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <h2 class="my-3">Asset transactions</h2>
      <v-row v-if="permissions?.length == 18" class="my-3">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="pa-6 h-100">
            <div class="">
              <h4>Total Earnings</h4>
            </div>

            <div v-if="asset_total?.length > 0" class="mt-11">
              <h2 class="mb-2">
                ₦‎
                {{
                  formatCurrency(
                    asset_total[0].total_approved_transactions_amount
                  )
                }}
              </h2>
              <span>All time</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="8">
          <v-card elevation="0" class="py-4 px-2">
            <div class="ml-8 d-flex align-center justify-space-between w-100">
              <div class="d-flex align-start justify-start flex-column w-100">
                <v-avatar color="#e5fafb" size="x-large">
                  <vue-feather
                    type="check-circle"
                    class="text-dark text-success"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ asset_total[0].total_approved_transactions_count }}
                  </h2>
                  <span>Successful</span>
                </div>
              </div>
              <div
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="grey" size="x-large">
                  <vue-feather
                    type="rotate-cw"
                    class="grey-lighten-1"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{
                      asset_total[0].total_transferred_transactions_count
                    }}
                  </h2>
                  <span>Transferred</span>
                </div>
              </div>
              <div
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="#FFF9C4" size="x-large">
                  <vue-feather
                    type="bar-chart"
                    class="text-dark text-primary"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ asset_total[0].total_pending_transactions_count }}
                  </h2>
                  <span>pending</span>
                </div>
              </div>
              <div
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="#FFCCBC" size="x-large">
                  <vue-feather
                    type="x-circle"
                    class="text-dark text-error"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ asset_total[0].total_declined_transactions_count }}
                  </h2>
                  <span>Failed</span>
                </div>
              </div>
              <div
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="purple" size="x-large">
                  <vue-feather
                    type="check"
                    class="purple-lighten-1"
                  ></vue-feather>
                </v-avatar>

                <div v-if="asset_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{
                      asset_total[0].total_partially_approved_transactions_count
                    }}
                  </h2>
                  <span>Partial</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-card flat rounded="0" elevation="0" class="my-5 pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <h4>Filter Options:</h4>
          <div>
            <v-btn @click="reset" width="200px" class="mr-4">Reset</v-btn>
            <v-btn
              @click="
                getAllAssetTransactions(status, page, type, search, date, date2)
              "
              width="200px"
              color="secondary"
              >Filter</v-btn
            >
          </div>
        </div>

        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              label="Filter by reference"
              density="compact"
              v-model="search"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              label="Filter by status"
              density="compact"
              :persistent-placeholder="true"
              :placeholder="'Select'"
              v-model="status"
              :items="['Approved', 'Declined', 'Transferred', 'Pending']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              label="Filter by trade type"
              density="compact"
              placeholder="Select"
              v-model="type"
              :items="['Buy', 'Sell']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date"
              type="date"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date2"
              type="date"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="pa-5">
        <v-tabs v-model="tab" bg-color="none" class="mb-5 border-bottom">
          <v-tab @click="getAllAssetTransactions((status = ''))">All</v-tab>
          <v-tab @click="getAllAssetTransactions((status = 'transferred'))"
            >Transferred</v-tab
          >
          <v-tab @click="getAllAssetTransactions((status = 'pending'))"
            >Pending</v-tab
          >
          <v-tab @click="getAllAssetTransactions((status = 'approved'))"
            >Approved</v-tab
          >
          <v-tab @click="getAllAssetTransactions((status = 'declined'))"
            >Declined</v-tab
          >
          <v-tab @click="getAllAssetTransactions((status = 'partial'))"
            >Partial</v-tab
          >
        </v-tabs>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="(headings, index) in header"
                :key="index"
                class="text-left"
              >
                {{ headings.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="allTransactions?.data?.length > 0 && loading == false">
            <tr v-for="(item, index) in allTransactions?.data" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td class="font-weight-bold">
                {{ item.user?.firstname ?? "No name" }}
                {{ item.user?.lastname }}
              </td>
              <td>{{ item.reference }}</td>
              <td>₦‎{{ item.payable_amount.toLocaleString() }}</td>
              <td>
                {{
                  useDateFormat(item?.created_at, "DD, MMMM-YYYY hh:mm a").value
                }}
              </td>
              <td>{{ item.trade_type }}</td>

              <td>
                <v-chip
                  label
                  class="text-capitalize font-weight-bold pa-3"
                  :color="status_color(item?.status)"
                  >{{ formate_text(item?.status) }}</v-chip
                >
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
                        :to="{
                          name: 'ViewAssetsTransaction',
                          params: { id: item?.id },
                        }"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Details </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :to="{
                          name: 'ViewAssetsTransaction',
                          params: { id: item?.id },
                        }"
                        link
                        color="secondary"
                        target="_blank"
                      >
                        <v-list-item-title> View Details In New Tab</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'transferred'"
                        @click="openConfirmationDialog('approve', item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Approve Request </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'transferred'"
                        @click="(dialog = true), (confirmationID = item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Partial Approval
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item?.status == 'transferred'"
                        @click="(dialog2 = true), (confirmationID = item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Decline Request </v-list-item-title>
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
          v-if="allTransactions?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>
      <v-pagination
        v-model="page"
        :length="allTransactions?.last_page"
        @next="getAllAssetTransactions(status, page, type)"
        @prev="getAllAssetTransactions(status, page, type)"
        @update:modelValue="getAllAssetTransactions(status, page, type)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-dialog v-if="dialog2" v-model="dialog2" max-width="500px" width="100%">
      <v-card max-width="500px">
        <v-card-text>
          <h3>Decline Transaction</h3>
          <p>Enter Reasons for Declining this asset transaction</p>
        </v-card-text>

        <v-container class="mt-7">
          <v-textarea
            label="Comments"
            v-model="note"
            variant="outlined"
          ></v-textarea>

          <v-file-input
            @change="get_reproof"
            hint="Optional"
            persistent-hint
            label="Review proof"
            append-inner-icon="mdi-paperclip"
            prepend-icon=""
          ></v-file-input>

          <v-btn
            color="secondary"
            class="my-5"
            block
            :loading="declining"
            @click="openConfirmationDialog('decline', confirmationID)"
            >Submit</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog = false"
            icon="mdi-close"
            color="secondary"
            variant="text"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>
        <v-form class="my-10">
          <v-text-field
            prefix="₦‎"
            v-model="partial_approve.review_amount"
            type="number"
            variant="outlined"
            label="Amount"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Review Note"
          ></v-textarea>
          <label for="proof" class="cursor-pointer">
            <p class="text-black">Upload transaction proof</p>
          </label>
          <label v-if="!previewList.length" for="proof" class="cursor-pointer">
            <img
              src="../../assets/images/card-placeholder.svg"
              alt="card-placeholder"
              class="mt-3 w-full object-fill max-h-[174px] rounded-xl"
            />
          </label>
          <input
            type="file"
            multiple
            id="proof"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            @change="partial(($event.target as HTMLFormElement).files)"
          />
          <div
            class="gap-5 mt-5"
            style="
              display: grid;
              grid-template-columns: repeat(4, 80px);
              gap: 12px;
            "
          >
            <div v-for="(image, index) in previewList" :key="index">
              <div style="position: relative">
                <img
                  class="w-full cursor-pointer"
                  style="height: 75px; object-fit: cover; width: 100%"
                  :src="image"
                />
                <img
                  src="@/assets/images/cancel-svgrepo-com.svg"
                  class="absolute rounded-full border border-red-700 -top-2 -right-2 bg-red-200 text-red-500 cursor-pointer"
                  style="position: absolute; right: -5px; top: -5px"
                  width="20"
                  @click="removeImage(image, index)"
                />
              </div>
            </div>
          </div>
          <div v-if="uploadingImage" class="pt-3 text-center">
            <small class="p-2 block"
              >Uploaded {{ startImage }} of {{ totalImage }}...</small
            >
          </div>
          <label
            v-if="previewList.length"
            for="proof"
            class="mt-4 d-flex align-center cursor-pointer"
          >
            <img src="../../assets/images/plus-icon.svg" alt="plus icon" />
            <p class="ml-3 underline">Add more proof</p>
          </label>
          <v-btn
            :loading="loading"
            @click="openConfirmationDialog('partial', confirmationID)"
            block
            class="mt-5"
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
