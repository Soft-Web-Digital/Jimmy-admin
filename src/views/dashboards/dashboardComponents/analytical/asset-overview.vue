<script setup lang="ts">
import { inject, ref } from "vue";



interface withdrawal {
  asset_total:[]
}



const revenue = ref(inject<withdrawal>("revenue"));

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};

</script>

<template>
  <v-card class="bg-secondary">
    <v-card-text>
      <div class="d-flex align-start">
        <h2 class="font-weight-medium title text-white mt-1">Total Crypto Transactions</h2>
        <v-spacer></v-spacer>
        <div class="ml-auto">
          <v-btn depressed color="white" class="btn-custom-sm" small icon>
            <vue-feather type="dollar-sign" class="text-dark"></vue-feather>
          </v-btn>
        </div>
      </div>
      <div v-for="(item, index)  in revenue.asset_total" :key="index" class="mt-4">
        <h2 class="text-white text-h5">₦‎ {{formatCurrency(item.total_approved_transactions_amount)}}</h2>
        <span class="text-white op-5 subtitle-1">Monthly revenue</span>
      </div>
    </v-card-text>
  </v-card>
</template>
