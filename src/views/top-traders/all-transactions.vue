<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTradersStore } from "../../stores/toptraders";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { watchDebounced } from "@vueuse/core";
import { computed } from "vue";
// import { storeToRefs } from "pinia";

const { getAllAssetTraders, getAllGiftcardTraders } = useTradersStore();

const {
  asset_traders,
  giftcard_traders,
  loading,
  tab,
  total_asset_traded,
  total_asset_traders,
  total_giftcard_traded,
  total_giftcard_traders,
} = storeToRefs(useTradersStore());
// const page = ref(1);

const getStatus = computed<any>(() => {
  return tab.value === 0 ? false : true;
});

const header = ref([
  {
    title: "No.",
    hidden: false,
  },
  {
    title: "Full name",
    hidden: false,
  },
  {
    title: "Email",
    hidden: false,
  },
  {
    title: "Phone",
    hidden: false,
  },
  {
    title: "Total trade",
    hidden: false,
  },
  {
    title: "Total amount traded",
    hidden: getStatus,
  },
  {
    title: "Total Payable amount",
    hidden: false,
  },
  {
    title: "Date and Time Joined",
    hidden: false,
  },
  {
    title: "Actions",
    hidden: false,
  },
]);

const limit = ref(20);
const date = ref("");
const date2 = ref("");
// const search_by_reference = () => {
//   watchDebounced(
//     search,
//     async () => {
//       await getAllAssetTransactionByReference(search.value);
//     },
//     { debounce: 1000, maxWait: 5000 }
//   );
// };

// Define the function that will be called every 2 minutes
const fetchData = async () => {
  await getAllAssetTraders();
  await getAllGiftcardTraders();
};

// Set up the interval on mount
let intervalId = ref<any>(null);
onMounted(() => {
  fetchData();
  intervalId.value = setInterval(fetchData, 120000); // 120000 milliseconds = 2 minutes
});

const reset = async () => {
  (limit.value = 20), (date.value = ""), (date2.value = "");
  await getAllAssetTraders();
  await getAllGiftcardTraders();
};

// Clear the interval on unmount
onUnmounted(() => {
  clearInterval(intervalId.value);
});

const getData = computed<any>(() => {
  return tab.value === 0 ? giftcard_traders : asset_traders;
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "approved" | "declined" | "partially_approved";
//

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

// const reset = async () => {
//   (status.value = ""),
//     (page.value = 1),
//     (type.value = ""),
//     (search.value = ""),
//     (date.value = ""),
//     (date2.value = "");
//   await get(
//     status.value,
//     page.value,
//     type.value,
//     search.value,
//     date.value,
//     date2.value
//   );
// };
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <h2 class="my-3">Top Traders</h2>
      <v-row class="my-3">
        <v-col cols="12" sm="6" md="6">
          <v-card elevation="0" class="py-4 px-2">
            <div class="ml-16 d-flex align-center justify-space-between w-100">
              <div class="d-flex align-start justify-start flex-column w-100">
                <v-avatar color="#e5fafb" size="x-large">
                  <vue-feather
                    type="check-circle"
                    class="text-dark text-success"
                  ></vue-feather>
                </v-avatar>

                <div class="pl-3 my-5">
                  <h2 class="mb-2">
                    ₦‎{{ formatCurrency(total_giftcard_traded || 0) || 0 }}
                  </h2>
                  <span>Total Giftcards Traded</span>
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

                <div class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ total_giftcard_traders || 0 }}
                  </h2>
                  <span>Top Giftcards Trades</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card elevation="0" class="py-4 px-2">
            <div class="ml-16 d-flex align-center justify-space-between w-100">
              <div class="d-flex align-start justify-start flex-column w-100">
                <v-avatar color="#e5fafb" size="x-large">
                  <vue-feather
                    type="check-circle"
                    class="text-dark text-success"
                  ></vue-feather>
                </v-avatar>

                <div class="pl-3 my-5">
                  <h2 class="mb-2">
                    ₦‎{{ formatCurrency(total_asset_traded || 0) || 0 }}
                  </h2>
                  <span>Total Assets Traded</span>
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

                <div class="pl-3 my-5">
                  <h2 class="mb-2">
                    {{ total_asset_traders || 0 }}
                  </h2>
                  <span>Top Assets Trades</span>
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
                tab === 0
                  ? getAllGiftcardTraders(limit, date, date2)
                  : getAllAssetTraders(limit, date, date2)
              "
              width="200px"
              color="secondary"
              >Filter</v-btn
            >
          </div>
        </div>

        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Filter by limit"
              density="compact"
              type="number"
              v-model="limit"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date"
              type="datetime-local"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Filter by date created"
              density="compact"
              v-model="date2"
              type="datetime-local"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="pa-5">
        <v-tabs v-model="tab" bg-color="none" class="mb-5 border-bottom">
          <v-tab @click="getAllGiftcardTraders()">Giftcards</v-tab>
          <v-tab @click="getAllAssetTraders()">Assets</v-tab>
        </v-tabs>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="(headings, index) in header"
                :key="index"
                class="text-left"
                v-show="!headings.hidden"
              >
                <p>
                  {{ headings.title }}
                </p>
              </th>
            </tr>
          </thead>
          <tbody v-if="getData.value?.length > 0 && loading == false">
            <tr v-for="(item, index) in getData.value" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td
                class="font-weight-bold username"
                @click="
                  $router.push({
                    name: 'UserDetails',
                    params: { id: item.id },
                  })
                "
              >
                {{ item.firstname ?? "No name" }}
                {{ item.lastname }}
              </td>
              <td>{{ item.email }}</td>
              <td>0{{ item.phone_number }}</td>
              <td>
                {{
                  tab === 0
                    ? item.giftcard_transactions_count
                    : item.asset_transactions_count
                }}
              </td>
              <td v-if="tab === 0">
                ${{
                  formatCurrency(
                    Number(item.giftcard_transactions_sum_amount) || 0
                  )
                }}
              </td>
              <td>
                ₦‎{{
                  tab === 0
                    ? formatCurrency(
                        Number(item.giftcard_transactions_sum_payable_amount) ||
                          0
                      )
                    : formatCurrency(
                        Number(item.asset_transactions_sum_payable_amount) || 0
                      )
                }}
              </td>
              <td>
                  {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
                <div>
                  {{ useDateFormat(item?.created_at, "hh:mm a").value }}
                </div>
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
                          name: 'UserDetails',
                          params: { id: item.id },
                        }"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View User </v-list-item-title>
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
          v-if="getData.value?.length <= 0 && loading == false"
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
      <!-- <v-pagination
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
      ></v-pagination> -->
    </v-col>
  </v-row>
</template>

<style scoped>
.username {
  text-decoration: underline;
  cursor: pointer;
}
table tbody tr td {
  padding: 15px !important;
}
</style>
