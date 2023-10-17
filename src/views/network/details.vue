<script setup lang="ts">

</script>

<template>
  <v-row>
    <v-btn 
        class="ml-4" 
        link
        size="large"
        variant="plain"
        color="grey-darken-4"
        :to="{name:'Apps'}"
    >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Withdrawals
  </v-btn>
    <v-col cols="12" sm="12" lg="12">
      <v-card>
        <v-toolbar color="transparent">
          <v-toolbar-title class="font-weight-medium">
            View Transaction
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-row class="px-4">
       
            <v-col cols="12" sm="12" lg="6">
            <v-card :loading="loading" class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <!-- <v-img
                cover
                height="250"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              ></v-img> -->

              <v-card-item class="pa-0 mb-5">
                <v-card-title class="pa-4">General Information</v-card-title>
                <v-divider></v-divider>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0 mb-3">
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3 mr-4"
                   
                    ></v-chip
                  >
                </v-row>

                <div class="mb-5">
                  <strong>Username:</strong>
                  <!-- {{ `${singleWithdrawal.user?.firstname} ${singleWithdrawal.user?.lastname}` }} -->
                </div>

                <div class="mb-5">
                  <strong>Email:</strong>
                  <!-- {{ singleWithdrawal.user?.email }} -->
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Amount:</strong>
                  <!-- &#x20A6{{ singleWithdrawal.amount?.toLocaleString() }} -->
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Wallet Balance:</strong>
                  <!-- &#x20A6{{ singleWithdrawal.user?.wallet_balance.toLocaleString() }} -->
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Date:</strong>
                   <!-- {{
                        useDateFormat(singleWithdrawal?.created_at, "DD, MMMM-YYYY hh:mm a").value
                    }} -->
                </div>
              </v-card-text>

              <v-divider class="mx-4 mb-1"></v-divider>

              <v-card-actions>
                    <v-btn
                    class="mr-4"
                  color="green lighten-3"
                 
                  variant="tonal"
                
                >
                  Approve
                </v-btn>

                <v-btn
                  color="red lighten-3"
                  variant="tonal"
                  
                >
                  Decline
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-col>

            <v-col cols="12" sm="12" lg="6">
                <v-card class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-item>
                <v-card-title>Payment Information</v-card-title>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Bank name:</strong>
                  <!-- {{ singleWithdrawal.bank?.name }} -->
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account name:</strong>
                  <!-- {{ singleWithdrawal?.account_name}} -->
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account Number:</strong>
                  <!-- {{ singleWithdrawal?.account_number}} -->
                </div>
              </v-card-text>  
            </v-card>

            
            </v-col>
        </v-row>
      </v-card>
    </v-col>

   
  </v-row>
</template>
