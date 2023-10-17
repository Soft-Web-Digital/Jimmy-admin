<template>
  <div>
    <h2>All currencies</h2>

    <v-card class="my-5 pa-3">
      <v-row>
        <v-col cols="12" sm="5">
          <v-text-field
            placeholder="Search for currencies by name"
            variant="outlined"
            density="compact"
           
            v-model="search"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-table>
        <thead>
          <tr>
            <th
              v-for="(headings, index) in currency_header"
              :key="index"
              class="text-left font-weight-bold"
            >
              {{ headings.title }}
            </th>
          </tr>
        </thead>

        <tbody v-if="loading === false">
          <tr
            class="pa-3"
            v-for="(data, index) in sortItems(currencies)"
            :key="data?.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ data?.name }}</td>
            <td>{{ data?.code }}</td>
            <td>{{ data?.exchange_rate_to_ngn }}</td>
            <td>{{ data?.buy_rate }}</td>
            <td>{{ data?.sell_rate }}</td>
            <td>
              <v-row>
                <v-menu transition="scroll-y-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      text
                      icon="mdi-dots-vertical"
                      color="transparent"
                      v-bind="props"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="
                        dialog = true;
                        id = data?.id;
                      "
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        Update Currency Rate
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
        v-if="loading == true"
        class="align-center justify-center w-100 my-5"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <h3>Update Currency</h3>
        <v-form class="mt-8 py-8">
          <v-text-field
            v-model="exchange_rate_to_ngn"
            label="Exchange rate"
            variant="outlined"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="buy_rate"
            type="number"
            label="Buy rate"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="sell_rate"
            type="number"
            label="Sell rate"
            variant="outlined"
          ></v-text-field>
          <v-btn
            :loading="loading"
            color="secondary"
            block
            @click="updateCurrency(id)"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCountryStore } from "../stores/country";
import { storeToRefs } from "pinia";
import { watchDebounced } from "@vueuse/core";
const { getCurrency, updateCurrency } = useCountryStore();
import useFormatter from "@/composables/useFormatter";
const { currencies, loading, dialog, exchange_rate_to_ngn, sell_rate, buy_rate } = storeToRefs(
  useCountryStore()
);
const { sortItems } = useFormatter();
const id = ref("");
const search = ref("");
onMounted(async () => {
  await getCurrency();
});

// const search_by_reference = computed(() => {
    
//     const search_lowercase = search.value.toLowerCase()
//         if (!search_lowercase) return currencies.value

//     search_fcn(search_lowercase)
        

// });

const search_fcn = (value:string) => {
  watchDebounced(
    search,
     () => {
      return currencies.value.filter((currency: { name: string }) => {
            // const currency_name = currency.name.toLowerCase()
            console.log(currency)
        });
    },
    { debounce: 500, maxWait: 500 }
  );
};



const currency_header = ref([
  {
    title: "No.",
  },
  {
    title: "name",
  },
  {
    title: "code",
  },
  {
    title: "Exchange rate to naria",
  },
  {
    title: "Buy rate",
  },
  {
    title: "Sell rate",
  },
  {
    title: "Action",
  },
]);
</script>

<style scoped></style>
