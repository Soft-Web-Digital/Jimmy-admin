<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted, watch } from "vue";
import { useGiftCardStore } from "../../stores/giftcard";
import uploadImage from "@/composables/uploadImage";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { useWithdrawalsStore } from "../../stores/withdrawals";

const action = useAuthStore();

// check
const {
  getAllGiftCardTransaction,
  declineRequest,
  approveRequest,
  getAllGiftCardTransactionByUserId,
  partialApproveRequest,
  giftCardTransactionQueries,
  exportGiftcards,
} = useGiftCardStore();

const { getAllTransactionCount } = useWithdrawalsStore();

const { userID, permissions } = storeToRefs(useAuthStore());

const { giftcard_total } = storeToRefs(useWithdrawalsStore());

let uploadingImage = ref<boolean>(false);
let startImage = ref<number>(1);
let totalImage = ref<number>(1);

const {
  gift_transactions,
  loading,
  singleGiftCardTransaction,
  declining,
  approving,
  dialog,
  dialog2,
  page,
  tab,
  status,
} = storeToRefs(useGiftCardStore());

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

// Get and sum up total earnings from list of transactions
// const totalEarnings = ref<any>(0);
// watch(gift_transactions, (newValue, oldValue) => {
//   let total = 0;
//   gift_transactions.value?.data.forEach((transaction: any) => {
//     total += transaction.payable_amount;
//   });
//   totalEarnings.value = formatCurrency(total);
// });

// const dialog2 = ref(false);
const note = ref("");
const id = ref("");
// const disapprove = () => {
//   if (dialog.value == true) {
//     dialog.value = false;
//   }
//   dialog2.value = true;
// };
function clearMessage() {
  reference.value = "";
}
const reproof = ref<any>([]);
const get_reproof = ($event: any) => {
  uploadingImage.value = true;
  let count = $event.length;
  let index = 0;
  if (event) {
    totalImage.value = $event.length;
    while (count--) {
      // proofs.value.push($event[index]);
      uploadImage($event[index]).then((response) => {
        startImage.value++;
        previewList.value.push(response.secure_url);
        reproof.value.push(response.secure_url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};
const partial_approve = reactive({
  review_amount: "",
  review_note: "",
  review_proof: <any>[],
});
// const partial_reproof = ref('')
const removeImage = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  partial_approve.review_proof.splice(index, 1);
};
const removeImageDecline = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  reproof.value.splice(index, 1);
};
const previewList = ref<any>([]);
const partial = ($event: any) => {
  uploadingImage.value = true;
  let count = $event.length;
  console.log($event);
  let index = 0;
  if (event) {
    totalImage.value = $event.length;
    while (count--) {
      // proofs.value.push($event[index]);
      uploadImage($event[index]).then((response) => {
        startImage.value++;
        previewList.value.push(response.secure_url);
        partial_approve.review_proof.push(response.secure_url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};

const header = ref([
  {
    title: "No.",
  },
  {
    title: "User name",
  },
  {
    title: "Category",
  },
  {
    title: "Reference No.",
  },
  {
    title: "Trade Type.",
  },

  {
    title: "Amount",
  },
  {
    title: "Date",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);
//
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Transactions",
    disabled: true,
    href: "#",
  },
]);

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

const status_options = ref([
  "Pending",
  "Approved",
  "Declined",
  "Partially_approved",
]);
const trade = ref("");
const trade_type = ref(["Buy", "Sell"]);
// const page = ref(1);
const date_from = ref("");
const date_to = ref("");
const reference = ref("");

const nextPage = (val: any) => {
  page.value = val;
};

const formate_text = (text: string) => {
  if (text === "partially_approved") return "Partial";
  return text;
};

const reset = async () => {
  (status.value = ""),
    (trade.value = ""),
    (page.value = 1),
    (date_from.value = ""),
    (date_to.value = "");

  await getAllGiftCardTransaction(
    status.value,
    trade.value,
    page.value,
    date_from.value,
    date_to.value,
    reference.value
  );
};

let intervalId = ref<any>(null);
onMounted(async () => {
  await action.GetProfile();
  await getAllTransactionCount();
  await getAllGiftCardTransaction(
    status.value,
    trade.value,
    page.value,
    date_from.value,
    date_to.value,
    reference.value
  );
});

var pusher = new Pusher("3dfb78cfe4587bd725fe", {
// var pusher = new Pusher("6a554a25e5327334c7e2", {
// var pusher = new Pusher("2bd4bb8b30b7085ba28d", {
  cluster: "eu",
  // cluster: "mt1",
});

var channel = pusher.subscribe("giftcards");
channel.bind("new-giftcard", function (data: any) {
  console.log(data);
  // if (gift_transactions.value) {
  //   gift_transactions.value?.data.unshift(data?.giftcard);
  // }

  if (gift_transactions.value) {
    // Check if the logged-in user's ID is present in the giftcard_category.admins array
    var isAdmin = data.giftcard.giftcard_product.giftcard_category.admins.some(function (admin) {
      return admin.id === userID.value;
    });

    if (isAdmin || userID.value === "98ba57af-00f7-47fc-947b-4fd31de50d26" || userID.value === "98dd12f9-7ddb-4b3e-ac30-d41c7293d260") {
      gift_transactions.value?.data.unshift(data?.giftcard);
    }
  }
});

onUnmounted(() => {
  pusher.unsubscribe("giftcards");
});
const refresh = async () => {
  await getAllGiftCardTransaction(
    status.value,
    trade.value,
    page.value,
    date_from.value,
    date_to.value,
    reference.value
  );
  previewList.value = [];
  uploadingImage.value = false;
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
    await approveRequest(confirmationID.value);
    refresh();
    confirmationDialog.value = false;
  } else if (type == "decline") {
    declineRequest(confirmationID.value, note.value, reproof.value as any);
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
  <div class="d-flex justify-space-between">
    <h3>Giftcard Transactions</h3>
    <v-btn @click="exportGiftcards" width="200px" color="secondary"
      >Export</v-btn
    >
  </div>
  <v-row v-if="permissions?.length == 18" class="my-3">
    <v-col cols="12" sm="6" md="4">
      <v-card elevation="0" class="pa-6 h-100">
        <div class="">
          <h4>Total Earnings</h4>
        </div>

        <div v-if="giftcard_total?.length > 0" class="mt-11">
          <h2 class="mb-2">
            ₦‎{{
              formatCurrency(
                giftcard_total[0].total_approved_transactions_amount
              )
            }}
          </h2>
          <span>All time</span>
        </div>
        <p v-else>loading...</p>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="8">
      <v-card elevation="0" class="py-4 px-2">
        <div class="ml-16 d-flex align-center justify-space-between w-100">
          <div class="d-flex align-start justify-start flex-column w-100">
            <v-avatar color="#e5fafb" size="x-large">
              <vue-feather
                type="check-circle"
                class="text-dark text-success"
              ></vue-feather>
            </v-avatar>

            <div v-if="giftcard_total?.length > 0" class="pl-3 my-5">
              <h2 class="mb-2">
                {{
                  formatCurrency(
                    giftcard_total[0].total_approved_transactions_count
                  )
                }}
              </h2>
              <span>Successful</span>
            </div>
            <p v-else>loading...</p>
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

            <div v-if="giftcard_total?.length > 0" class="pl-3 my-5">
              <h2 class="mb-2">
                {{
                  formatCurrency(
                    giftcard_total[0].total_pending_transactions_count
                  )
                }}
              </h2>
              <span>Pending</span>
            </div>
            <p v-else>loading...</p>
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

            <div v-if="giftcard_total?.length > 0" class="pl-3 my-5">
              <h2 class="mb-2">
                {{
                  formatCurrency(
                    giftcard_total[0].total_declined_transactions_count
                  )
                }}
              </h2>
              <span>Failed</span>
            </div>
            <p v-else>loading...</p>
          </div>
          <div
            class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
          >
            <v-avatar color="purple" size="x-large">
              <vue-feather type="check" class="purple-lighten-1"></vue-feather>
            </v-avatar>

            <div v-if="giftcard_total?.length > 0" class="pl-3 my-5">
              <h2 class="mb-2">
                {{
                  formatCurrency(
                    giftcard_total[0]
                      .total_partially_approved_transactions_count
                  )
                }}
              </h2>
              <span>Partial</span>
            </div>
            <p v-else>loading...</p>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-card flat elevation="0" rounded="0" class="my-5 pa-4">
    <div class="d-flex align-center justify-space-between w-100">
      <h4>Filter Options:</h4>
      <div>
        <v-btn @click="reset" width="200px" class="mr-4">Reset</v-btn>
        <v-btn
          @click="
            getAllGiftCardTransaction(
              status,
              trade,
              page,
              date_from,
              date_to,
              reference
            )
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
          label="Filter by Reference"
          v-model="reference"
          density="compact"
          variant="outlined"
          @click:clear="clearMessage"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="trade"
          label="Filter by trade type"
          density="compact"
          :items="trade_type"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="date_from"
          label="Filter date from"
          density="compact"
          type="date"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="date_to"
          type="date"
          label="Filter date to"
          density="compact"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <v-card class="pa-5">
        <v-tabs v-model="tab" bg-color="none" class="mb-5 border-bottom">
          <v-tab @click="getAllGiftCardTransaction((status = ''))">All</v-tab>
          <v-tab @click="getAllGiftCardTransaction((status = 'pending'))"
            >Pending</v-tab
          >
          <v-tab @click="getAllGiftCardTransaction((status = 'approved'))"
            >Approved</v-tab
          >
          <v-tab @click="getAllGiftCardTransaction((status = 'declined'))"
            >Declined</v-tab
          >
          <v-tab @click="getAllGiftCardTransaction((status = 'partial'))"
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
          <TransitionGroup
            name="list"
            tag="tbody"
            v-if="gift_transactions?.data?.length > 0 && loading == false"
          >
            <tr v-for="(item, index) in gift_transactions?.data" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td
                class="font-weight-bold username"
                @click="
                  $router.push({
                    name: 'UserDetails',
                    params: { id: item?.user_id },
                  })
                "
              >
                {{ item.user.firstname }} {{ item.user.lastname }}
              </td>
              <td>{{ item?.giftcard_product?.giftcard_category?.name }}</td>
              <td>{{ item.reference }}</td>
              <td>{{ item.trade_type }}</td>
              <td>
                ₦‎
                {{
                  formatCurrency(
                    item.payable_amount *
                      (item.children_count && item.children_count !== 0
                        ? item.children_count + 1
                        : 1)
                  )
                }}
              </td>
              <td>
                {{
                  useDateFormat(item?.created_at, "DD-MM-YYYY hh:mm a").value
                }}
              </td>
              <!-- <td>{{ item.trade_type }}</td> -->
              <td>
                <v-chip
                  label
                  size="small"
                  class="text-capitalize font-weight-bold pa-3"
                  :color="status_color(item?.status)"
                  >{{ formate_text(item?.status) }}</v-chip
                >
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
                        :to="{
                          name:
                            item.children_count && item.children_count > 0
                              ? 'RelatedGiftCards'
                              : 'ViewGiftCardTransaction',
                          params: { id: item.id },
                        }"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          {{
                            item.children_count && item.children_count > 0
                              ? "View List"
                              : "View giftcard"
                          }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :to="{
                          name:
                            item.children_count && item.children_count > 0
                              ? 'RelatedGiftCards'
                              : 'ViewGiftCardTransaction',
                          params: { id: item.id },
                        }"
                        link
                        target="_blank"
                        color="secondary"
                      >
                        <v-list-item-title>
                          {{
                            item.children_count && item.children_count > 0
                              ? "View List In New Tab"
                              : "View Giftcard In New Tab"
                          }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="
                          item?.status == 'pending' && item?.children_count == 0
                        "
                        @click="openConfirmationDialog('approve', item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Approve giftcard
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="
                          item?.status == 'pending' && item.children_count == 0
                        "
                        @click="(dialog = true), (confirmationID = item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Partial approval
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="
                          item?.status == 'pending' && item.children_count == 0
                        "
                        @click="(dialog2 = true), (confirmationID = item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          Decline giftcard
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
            </tr>
          </TransitionGroup>
        </v-table>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
        <p
          class="font-weight-bold text-center my-3"
          v-if="gift_transactions?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>
      </v-card>
      <v-pagination
        v-model="page"
        :length="gift_transactions?.last_page"
        @next="
          (...args) =>
            getAllGiftCardTransaction(
              status,
              trade,
              ...args,
              date_from,
              date_to,
              reference
            )
        "
        @prev="
          (...args) =>
            getAllGiftCardTransaction(
              status,
              trade,
              ...args,
              date_from,
              date_to,
              reference
            )
        "
        @update:modelValue="
          (...args) =>
            getAllGiftCardTransaction(
              status,
              trade,
              ...args,
              date_from,
              date_to,
              reference
            )
        "
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-dialog
      v-if="dialog"
      v-model="dialog"
      max-width="429px"
      min-height="476px"
    >
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
            label="Review Amount"
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
            :loading="approving"
            @click="openConfirmationDialog('partial', confirmationID)"
            class="mt-5"
            block
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
    <v-expand-transition>
      <v-dialog v-if="dialog2" v-model="dialog2" max-width="500px" width="100%">
        <v-card max-width="500px">
          <v-card-text>
            <h3>Decline Request</h3>
            <p>Enter Reasons for Declining this withdrawal request</p>
          </v-card-text>

          <v-container class="mt-7">
            <v-textarea
              label="Comments"
              v-model="note"
              variant="outlined"
            ></v-textarea>

            <label for="proof" class="cursor-pointer">
              <p class="text-black">Upload transaction proof</p>
            </label>
            <label
              v-if="!previewList.length"
              for="proof"
              class="cursor-pointer"
            >
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
              @change="get_reproof(($event.target as HTMLFormElement).files)"
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
                    @click="removeImageDecline(image, index)"
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
    </v-expand-transition>
  </v-row>
</template>

<style lang="scss">
table tbody tr td {
  padding: 15px !important;
  font-size: 12px;
}
.v-table td {
  font-size: 12px !important;
}
.username {
  text-decoration: underline;
  cursor: pointer;
}

.view-dialog {
  background: #ffffff;
  border-radius: 16px !important;

  h3 {
    font-weight: 600;
    font-size: 24px;
    width: 50%;
    line-height: 24px;
  }

  h5 {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    color: #afafaf;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 16px !important;
    line-height: 24px;
  }

  .wallet-btn {
    padding: 22px;
    border-radius: 8px;
    width: 188px;
    height: 64px;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
