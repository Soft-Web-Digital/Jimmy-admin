<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useAuthStore } from '../../stores/auth'
import { useWithdrawalsStore } from "../../stores/withdrawals";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const { permissions } = storeToRefs(useAuthStore())

const {
  getAllWithDrawals,
  approveRequest,
  declineRequest,
  getSingleWithDrawals,
  filterWithDrawalsByDateCreated,
  getAllTransactionCount,
} = useWithdrawalsStore();
const {
  withdrawals,
  loading,
  singleWithdrawal,
  dialog,
  disapproving,
  approving,
  withdrawals_total,
} = storeToRefs(useWithdrawalsStore());
const status = ref("");
const dialog2 = ref(false);

const fetchData = async () => {
  await getAllWithDrawals(status.value, 1);
  await getAllTransactionCount();
}

// Set up the interval on mount
let intervalId = ref<any>(null);
onMounted(() => {
  fetchData()
  intervalId.value = setInterval(fetchData, 120000); // 120000 milliseconds = 2 minutes
});

// Clear the interval on unmount
onUnmounted(() => {
  clearInterval(intervalId.value);
});

// const search = ref("");

const page_title = ref({ title: "Wallet Transactions" });
const note = ref("");
const breadcrumbs = ref([
  {
    text: "Transactions",
    disabled: false,
    href: "#",
  },
  {
    text: "Withdrawals",
    disabled: true,
    href: "#",
  },
]);

const header = ref([
  {
    title: "No.",
  },
  {
    title: "Full name",
  },
  {
    title: "Amount (NGN)",
  },
  {
    title: "Account number",
  },
  {
    title: "Date and Time",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);


const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

const id = ref("");
const disapprove = () => {
  if (dialog.value == true) {
    dialog.value = false;
  }
  dialog2.value = true;
};

const status_options = ref(["Pending", "Completed", "Declined"]);

// CHANGE STATUS COLOR
type StatusType = "pending" | "completed" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "completed"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//
// VIEW WITHDRAWAL
// const dialog = ref(false);
const fetching = ref(false);
const viewWithDrawalRequest = async (id: string) => {
  dialog.value = true;
  fetching.value = true;
  await getSingleWithDrawals(id);
  fetching.value = false;
};

const page = ref(1);

const date = ref("");
const tab = ref(null);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Height -->
  <!-- ----------------------------------------------------------------------------- -->
  <!-- <v-data-table></v-data-table> -->
  <div>
    <BaseBreadcrumb
      :title="page_title.title"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <div class="mt-4">
      <v-row v-if="permissions?.length == 18" class="my-3">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="pa-6 h-100">
            <div class="">
              <h4>Total earnings</h4>
            </div>

            <div v-if="withdrawals_total?.length > 0" class="mt-11">
              <h2 class="mb-2">
                ₦‎{{ formatCurrency(withdrawals_total[0].total_completed_transactions_amount) }}
              </h2>
              <span>All time</span>
            </div>
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

                <div v-if="withdrawals_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{
                      withdrawals_total[0].total_completed_transactions_count
                    }}
                  </h2>
                  <span>Successful</span>
                </div>
              </div>
              <div
                class="d-flex align-start justify-start flex-column w-100 flex-grow-1"
              >
                <v-avatar color="#FFF9C4" size="x-large">
                  <vue-feather
                    type="bar-chart"
                    class="text-dark"
                    style="color: #b2b200;"
                  ></vue-feather>
                </v-avatar>

                <div v-if="withdrawals_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ withdrawals_total[0].total_pending_transactions_count }}
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

                <div v-if="withdrawals_total?.length > 0" class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ withdrawals_total[0].total_declined_transactions_count }}
                  </h2>
                  <span>Failed</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pa-5">
        <v-tabs v-model="tab" bg-color="none" class="mb-5">
          <v-tab @click="getAllWithDrawals('')">All</v-tab>
          <v-tab @click="getAllWithDrawals('pending')">Pending</v-tab>
          <v-tab @click="getAllWithDrawals('completed')">Approved</v-tab>
          <v-tab @click="getAllWithDrawals('declined')">Declined</v-tab>
        </v-tabs>
        <v-window v-model="tab">
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
              <tr
                class="pa-3"
                v-for="(withdrawal, index) in withdrawals?.data"
                :key="withdrawal?.id"
              >
                <td>{{ index + 1 }}</td>
                <td class="font-weight-bold">
                  <span
                    @click="
                      $router.push({
                        name: 'UserDetails',
                        params: { id: withdrawal?.user_id },
                      })
                    "
                    class="text-capitalize username"
                  >
                    {{ withdrawal?.user?.firstname ?? "---" }}
                    {{ withdrawal?.user?.lastname ?? "---" }}</span
                  >
                </td>
                <td>₦‎ {{ withdrawal.amount.toLocaleString() }}</td>
                <td>{{ withdrawal?.account_number ?? "---" }}</td>
                <td>
                  {{
                    useDateFormat(withdrawal?.created_at, "DD, MMMM-YYYY").value
                  }}
                </td>
                <!-- <td>{{ item.status }}</td> -->

                <!-- <td>{{ item.service }}</td>
              <td>{{ item.type }}</td>

              <td>{{ item.date }}</td> -->
                <td>
                  <v-chip
                    label
                    class="text-capitalize font-weight-bold pa-3"
                    :color="status_color(withdrawal?.status)"
                    >{{ withdrawal?.status }}</v-chip
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
                            name: 'viewWithdrawals',
                            params: { id: withdrawal.id },
                          }"
                          link
                          color="secondary"
                        >
                          <v-list-item-title> View Details </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="withdrawal?.status == 'pending'"
                          @click="approveRequest(withdrawal?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Approve Withdrawal Request
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="withdrawal?.status == 'pending'"
                          @click="
                            id = withdrawal?.id;
                            disapprove();
                          "
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Decline Withdrawal Request
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <p
          v-if="loading == false && withdrawals?.data?.length <= 0"
          class="text-center py-6"
        >
          No data available
        </p>
      </v-card>
      <v-pagination
        v-model="page"
        :length="withdrawals?.last_page"
        @next="getAllWithDrawals(status, page)"
        @prev="getAllWithDrawals(status, page)"
        @update:modelValue="getAllWithDrawals(status, page)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Withdrawal request details</h3>
          <v-btn
            @click="dialog = false"
            icon="mdi-close"
            color="secondary"
            variant="text"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>
        <div class="my-3">
          <!-- <v-icon></v-icon> -->
          <div>
            <v-chip
              label
              size="small"
              density="comfortable"
              class="text-capitalize font-weight-bold pa-3"
              :color="status_color(singleWithdrawal?.status)"
              >{{ singleWithdrawal?.status }}</v-chip
            >
          </div>
        </div>
        <div
          v-if="fetching == false && loading == false"
          class="w-100 d-flex align-center justify-space-between"
        >
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="w-100 align-center justify-space-between"
          >
            <v-col class="pa-0">
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5>Wallet balance</h5>
                  <p class="font-weight-bold">
                    ₦‎{{
                      singleWithdrawal?.user?.wallet_balance.toLocaleString()
                    }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">User name</h5>
                  <p class="">
                    {{ singleWithdrawal?.user?.firstname }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Email address</h5>
                  <p class="">
                    {{ singleWithdrawal?.user?.email }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Date & time</h5>
                  <p class="">
                    {{
                      useDateFormat(
                        singleWithdrawal?.created_at,
                        "DD, MMMM-YYYY"
                      ).value
                    }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="w-100 align-center justify-space-between ml-5"
          >
            <v-col class="pa-0">
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5>Amount</h5>
                  <p class="font-weight-bold">
                    ₦‎{{ singleWithdrawal?.amount?.toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Bank name</h5>
                  <p class="">
                    {{ singleWithdrawal?.bank?.name ?? "No data" }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Account name</h5>
                  <p class="">
                    {{ singleWithdrawal?.account_name ?? "No data" }}
                  </p>
                </div>
              </div>
              <div class="mb-4">
                <!-- <v-icon></v-icon> -->
                <div>
                  <h5 class="">Account number</h5>
                  <p class="">
                    {{ singleWithdrawal?.account_number ?? "No data" }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-layout
          v-if="fetching == true || loading == true"
          class="align-center justify-center w-100 my-10"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>

        <!-- <v-btn color="secondary" class="my-2" block @click="dialog = false"
          >Close Dialog</v-btn
        > -->

        <div v-if="singleWithdrawal.status == 'pending' && fetching == false">
          <v-btn
            @click="disapprove"
            class="wallet-btn"
            variant="outlined"
            color="error"
            :loading="disapproving"
          >
            Disapprove request
          </v-btn>
          <!-- declineRequest(singleWithdrawal?.id) -->
          <v-btn
            @click="approveRequest(singleWithdrawal?.id)"
            class="wallet-btn ml-4"
            color="secondary"
            :loading="approving"
          >
            Approve request
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-expand-transition>
      <v-dialog
        v-if="dialog2"
        v-model="dialog2"
        activator="parent"
        max-width="500px"
        width="auto"
      >
        <v-card>
          <v-card-text>
            <p>Enter Reasons for Declining this withdrawal request</p>
          </v-card-text>

          <v-container class="mt-7">
            <v-textarea
              label="Comments"
              v-model="note"
              variant="outlined"
            ></v-textarea>

            <v-btn
              color="secondary"
              class="my-5"
              block
              @click="declineRequest(id, note)"
              >Submit</v-btn
            >
          </v-container>
        </v-card>
      </v-dialog>
    </v-expand-transition>
  </div>
</template>

<style lang="scss">
table tbody tr td {
  padding: 15px !important;
  font-size: 12px;
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
</style>
