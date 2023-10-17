<script setup lang="ts">
import { inject, computed, ref } from "vue";



interface withdrawal {
  withdrawals_total:[]
}



const revenue = ref(inject<withdrawal>("revenue"));

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};



</script>
<template>
  <v-card class="bg-primary">
    <v-card-text>
      <div class="d-flex align-start">
        <h2 class="font-weight-medium title text-white mt-1">
          Total Withdrawals
        </h2>
        <v-spacer></v-spacer>
        <div class="ml-auto">
          <v-btn depressed color="white" class="btn-custom-sm" small icon>
            <vue-feather type="credit-card" class="text-dark"></vue-feather>
          </v-btn>
        </div>
      </div>
      <div v-for="(items, index) in revenue.withdrawals_total" :key="index" class="mt-4">
        <h2  class="text-white text-h5">₦‎ {{formatCurrency(items.total_completed_transactions_amount)}}</h2>
        <span class="text-white op-5 subtitle-1">Monthly revenue</span>
      </div>
    </v-card-text>
  </v-card>
</template>
