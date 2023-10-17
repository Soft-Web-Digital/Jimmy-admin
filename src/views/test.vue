<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from "vue";
import { useGiftCardStore } from "../stores/giftcard";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { useQuery } from "vue-query";
import { useWithdrawalsStore } from "../stores/withdrawals";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
// check
const { giftCardTransactionQueries } = useGiftCardStore();

const { getAllTransactionCount } = useWithdrawalsStore();

const { permissions } = storeToRefs(useAuthStore());

const { giftcard_total } = storeToRefs(useWithdrawalsStore());

const {
  gift_transactions,
  loading,
  singleGiftCardTransaction,
  declining,
  approving,
  dialog,
} = storeToRefs(useGiftCardStore());

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

// Get and sum up total earnings from list of transactions

const dialog2 = ref(false);
const note = ref("");
const id = ref("");
const disapprove = () => {
  if (dialog.value == true) {
    dialog.value = false;
  }
  dialog2.value = true;
};
function clearMessage() {
  reference.value = "";
}
const reproof = ref("");
const get_reproof = (e: any) => {
  reproof.value = e.target.files[0];
};
const partial_approve = reactive({
  review_rate: "",
  review_note: "",
  review_proof: null,
});
// const partial_reproof = ref('')
const partial = (e: any) => {
  partial_approve.review_proof = e.target.files[0];
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

const page = ref({ title: "Gift Cards Transactions" });
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
const status = ref("");
const trade = ref("");
const trade_type = ref(["Buy", "Sell"]);
const page_no = ref(1);
const date_from = ref("");
const date_to = ref("");
const reference = ref("");

const nextPage = (val: any) => {
  page_no.value = val;
};

const tab = ref(null);

const formate_text = (text: string) => {
  if (text === "partially_approved") return "Partial";
  return text;
};



const { data, isLoading, isError, refetch, isFetching } = useQuery(
  ["transactions", page_no, status],
  () => giftCardTransactionQueries(status.value, page_no.value),
  {
    refetchOnWindowFocus:false,
    retry:4,
    staleTime:100000,
    select: (val) => {
      let value;
      value =  val?.data?.data?.giftcards;
      return value
    },
  }
);


const filter_by = (value:string) => {
    status.value = value
}

</script>
<template>
  <h3 class="mb-4">Giftcard Transactions test</h3>
  <!-- <v-row v-if="permissions?.length == 18" class="my-3">
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
                    giftcard_total[0].total_partially_approved_transactions_count
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
              page_no,
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
  </v-card> -->
  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
       <v-card-text class="pa-5">
        <v-tabs v-model="tab" bg-color="none" class="mb-5 border-bottom">
          <v-tab @click="filter_by((status = ''))">All</v-tab>
          <v-tab @click="filter_by((status = 'pending'))"
            >Pending</v-tab
          >
          <v-tab @click="filter_by((status = 'approved'))"
            >Approved</v-tab
          >
          <v-tab @click="filter_by((status = 'declined'))"
            >Declined</v-tab
          >
          <v-tab @click="filter_by((status = 'partial'))"
            >Partial</v-tab
          >
        </v-tabs>
        <v-table class="mt-5">
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
          <tbody v-if="data?.data?.length > 0 && isLoading == false && isFetching == false">
            <tr v-for="(item, index) in data?.data" :key="item.id">
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
              <td>₦‎ {{ item.payable_amount.toLocaleString() }}</td>

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
                            item.children_count > 0
                              ? 'RelatedGiftCards'
                              : 'ViewGiftCardTransaction',
                          params: { id: item.id },
                        }"
                        link
                        color="secondary"
                      >
                        <v-list-item-title>
                          {{
                            item.children_count > 0
                              ? "View List"
                              : "View giftcard"
                          }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="
                          item?.status == 'pending' && item.children_count == 0
                        "
                        @click="approveRequest(item?.id, page_no)"
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
                        @click="
                          dialog = true;
                          id = item.id;
                        "
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
                        @click="
                          id = item?.id;
                          disapprove();
                        "
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
          </tbody>
        </v-table>

        <v-layout
          v-if="isLoading == true "
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
        <p
          class="font-weight-bold text-center my-3"
          v-if="data?.data?.length <= 0 && isLoading == false && isFetching == false"
        >
          No data found
        </p>
         </v-card-text>
      </v-card>
      <v-pagination
        v-model="page_no"
        :length="data?.last_page"
        @next="
          nextPage
        "
        @prev="
          nextPage
        "
        @update:modelValue="
          nextPage
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
            v-model="partial_approve.review_rate"
            type="number"
            variant="outlined"
            label="Amount"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Review Note"
          ></v-textarea>
          <v-file-input
            prepend-icon=""
            variant="outlined"
            @change="partial"
            label="Review Proof"
          ></v-file-input>
          <v-btn
            :loading="approving"
            @click="partialApproveRequest(id, partial_approve)"
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
              @click="declineRequest(id, note, reproof, page_no)"
              >Submit</v-btn
            >
          </v-container>
        </v-card>
      </v-dialog>
    </v-expand-transition>
  </v-row>
</template>

<style lang="scss">

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
</style>
