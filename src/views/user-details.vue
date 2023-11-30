<template>
  <div>
    <v-btn
      class="mb-2"
      link
      size="large"
      variant="plain"
      color="grey-darken-4"
      :to="{ name: 'Users' }"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Users
    </v-btn>
    <v-card rounded="1">
      <div class="w-100">
        <div
          class="w-100"
          style="height: 150px; background-color: #34384f"
        ></div>
        <div
          style="margin-top: -60px"
          class="d-flex align-center justify-center flex-column w-100"
        >
          <v-avatar color="secondary" :size="80" class="my-4 position-relative">
            <v-img
              cover
              v-if="single_user.avatar !== null && single_user.avatar !== ''"
              :src="single_user.avatar"
            ></v-img>
            <span v-else class="text-h5 text-uppercase">{{
              single_user.email.slice(0, 2)
            }}</span>
          </v-avatar>

          <h3>{{ single_user.firstname }} {{ single_user.lastname }}</h3>
          <p>{{ single_user.email }}</p>
          <!-- 
          <p class="font-weight-bold mt-2">
            Phone:
            <span class="font-weight-light">{{ detail.phone_number }}</span>
          </p> -->
          <!-- <div class="text-center">
                <p>{{ detail.email }}</p>
                <p class="font-weight-bold mt-2">
                  Phone: <span class="font-weight-light">{{ detail.phone_number }}</span>
                </p>
                <p class="font-weight-bold mt-2">
                  Wallet balance:
                  <span class="font-weight-light">₦{{ detail.wallet_balance }}</span>
                </p>

                <div class="mt-6 d-flex align-center w-100">
                  <v-switch
                    color="secondary"
                    hide-details
                    inset
                    :label="'Restore User'"
                  ></v-switch>
                  <v-switch
                    color="secondary"
                    hide-details
                    inset
                    class="ml-4"
                    @input="blockUsers(detail?.id)"
                    :label="'Toggle Blocked Status'"
                  ></v-switch>
                </div>
              </div> -->
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mt-8">
        <div class="my-4 ml-4">
          <strong>Wallet balance:</strong> ₦<span>{{
            single_user.wallet_balance
          }}</span>
          <v-btn
            class="ml-4"
            @click="
              dialog2 = true;
              id = single_user?.id;
            "
            >Finance user</v-btn
          >
          <v-btn
            class="ml-4"
            color="error"
            @click="blockUser(single_user?.id)"
            >{{
              single_user?.blocked_at == null ? "Block user" : "Unblock user"
            }}</v-btn
          >
        </div>
        <v-tabs v-model="tab">
          <v-tab value="one" class="font-weight-bold">User Information</v-tab>
          <v-tab value="two" class="font-weight-bold">Asset</v-tab>
          <v-tab value="three" class="font-weight-bold">Giftcard</v-tab>
          <v-tab value="four" class="font-weight-bold">Wallet</v-tab>
          <v-tab value="five" class="font-weight-bold">Referrals</v-tab>
        </v-tabs>
      </div>
    </v-card>
    <v-window v-model="tab" class="mt-8">
      <v-window-item value="one">
        <v-row>
          <v-col cols="12" sm="12" lg="6">
            <v-card>
              <v-card-title class="ml-4 my-4">User Information</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <!-- <p class="mb-4">
                  Hello, I am Mathew Anderson. I love making websites and
                  graphics. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit.
                </p> -->

                <div class="mb-4">
                  <v-chip label :color="active_status(single_user?.blocked_at)">
                    {{ single_user?.blocked_at == null ? "Active" : "Blocked" }}
                  </v-chip>
                </div>

                <div class="mb-5">
                  <strong>Username: </strong
                  ><span class="ml-2">{{ single_user.username }}</span>
                </div>

                <div class="mb-5">
                  <strong>Email:</strong
                  ><span class="ml-2">{{ single_user.email }}</span>
                </div>

                <div class="mb-5">
                  <strong>Phone number:</strong
                  ><span class="ml-2">{{ single_user.phone_number }}</span>
                </div>

                <div class="mb-5">
                  <strong>Wallet balance:</strong>
                  <span>{{ single_user.wallet_balance }}</span>
                </div>

                <div>
                  <strong>Created:</strong>
                  <span class="ml-2">{{
                    useDateFormat(
                      single_user?.created_at,
                      "DD MMM YYYY-hh:mm a"
                    ).value
                  }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" lg="6">
            <v-card>
              <v-card-title class="ml-4 my-4">Other Information</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="mb-4">
                  <strong>Email verified at:</strong>
                  <span v-if="single_user.email_verified_at" class="ml-3">{{
                    useDateFormat(
                      single_user.email_verified_at,
                      "DD MMM YYYY-hh:mm a"
                    ).value
                  }}</span>
                  <span v-else class="ml-3">No data</span>
                </div>

                <div class="mb-5">
                  <strong>2FA activated at: </strong
                  ><span
                    v-if="single_user.two_fa_activated_at !== null"
                    class="ml-2"
                    >{{
                      useDateFormat(
                        single_user.two_fa_activated_at,
                        "DD MMM YYYY-hh:mm a"
                      ).value
                    }}</span
                  >
                  <span v-else class="ml-3">No data</span>
                </div>
                <div class="mb-5">
                  <strong>Transaction pin set: </strong
                  ><v-chip
                    :color="pin_status(single_user.transaction_pin_set)"
                    class="ml-2"
                    >{{
                      single_user.transaction_pin_set
                        ? "Activated"
                        : "Not activated"
                    }}</v-chip
                  >
                </div>
                <div class="mb-5">
                  <strong>Transaction pin activated at: </strong
                  ><span
                    v-if="single_user.transaction_pin_activated_at !== null"
                    class="ml-2"
                    >{{
                      useDateFormat(
                        single_user.transaction_pin_activated_at,
                        "DD, MMMM-YYYY"
                      ).value
                    }}</span
                  >
                  <span v-else class="ml-3">No data</span>
                </div>
                <div class="mb-5">
                  <strong>Deleted at: </strong
                  ><span v-if="single_user.deleted_at !== null" class="ml-2">{{
                    useDateFormat(single_user.deleted_at, "DD, MMMM-YYYY").value
                  }}</span>
                  <span v-else class="ml-3">No data</span>
                </div>
                <div>
                  <strong>Reason for deletion: </strong
                  ><span class="ml-2">{{
                    single_user.deleted_reason ?? "No data"
                  }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item value="two">
        <v-card flat rounded="0" elevation="0" class="my-5 pa-4">
          <h4>Filter Options:</h4>

          <v-row class="mt-3">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Filter by reference"
                density="compact"
                @blur="search_by_reference"
                v-model="search"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                label="Filter by status"
                density="compact"
                :persistent-placeholder="true"
                :placeholder="'Select'"
                @update:modelValue="getAllAssetTransactionsStatus"
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
                @update:modelValue="getAllAssetTransactionByTradeType"
                v-model="type"
                :items="['Buy', 'Sell']"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Filter by date created"
                density="compact"
                @update:modelValue="getAllAssetTransactionByDate"
                v-model="date"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="my-4">
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
            <tbody v-if="allTransactions?.data?.length > 0 && loading == false">
              <tr v-for="(item, index) in allTransactions.data" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.reference }}</td>
                <td>₦‎{{ item.payable_amount.toLocaleString() }}</td>
                <td>
                  {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
                </td>
                <td>{{ item.trade_type }}</td>

                <td>
                  <v-chip
                    label
                    class="text-capitalize font-weight-bold pa-3"
                    :color="status_color(item?.status)"
                    >{{ item?.status }}</v-chip
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
                          v-if="item?.status == 'transferred'"
                          @click="approveAssetTransactions(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Approve Request
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="item?.status == 'transferred'"
                          @click="declineAssetTransactions(item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Decline Request
                          </v-list-item-title>
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
          @next="filterAllAssetTransactionsByUserId(single_user.id, page)"
          @prev="filterAllAssetTransactionsByUserId(single_user.id, page)"
          @update:modelValue="filterAllAssetTransactionsByUserId(single_user.id, page)"
          active-color="red"
          :start="1"
          variant="flat"
          class="mt-5"
          color="bg-secondary"
          rounded="circle"
        ></v-pagination>
      </v-window-item>
      <v-window-item value="three">
        <v-card class="my-4">
          <v-table>
            <thead>
              <tr>
                <th
                  v-for="(headings, index) in giftcardHeader"
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
              <tr
                v-for="(item, index) in gift_transactions?.data"
                :key="item.id"
              >
                <td>{{ index + 1 }}</td>
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
                          v-if="
                            item?.status == 'pending' &&
                            item?.children_count == 0
                          "
                          @click="openConfirmationDialog('approve', item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Approve giftcard
                          </v-list-item-title>
                        </v-list-item>
                        <!-- <v-list-item
                          v-if="
                            item?.status == 'pending' &&
                            item.children_count == 0
                          "
                          @click="(dialog4 = true), (confirmationID = item?.id)"
                          link
                          color="secondary"
                        >
                          <v-list-item-title>
                            Partial approval
                          </v-list-item-title>
                        </v-list-item> -->
                        <v-list-item
                          v-if="
                            item?.status == 'pending' &&
                            item.children_count == 0
                          "
                          @click="(dialog3 = true), (confirmationID = item?.id)"
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
          @next="filterAllGiftCardTransactionByUserId(single_user.id, page)"
          @prev="filterAllGiftCardTransactionByUserId(single_user.id, page)"
          @update:modelValue="filterAllGiftCardTransactionByUserId(single_user.id, page)"
          active-color="red"
          :start="1"
          variant="flat"
          class="mt-5"
          color="bg-secondary"
          rounded="circle"
        ></v-pagination>
      </v-window-item>
      <v-window-item value="four">
        <v-card class="my-4">
          <v-table>
            <thead>
              <tr>
                <th
                  v-for="(headings, index) in withdrawalHeader"
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
        </v-card>
      </v-window-item>
      <v-window-item value="five">
        <v-card class="my-4">
          <v-table>
            <thead>
              <tr>
                <th
                  v-for="(headings, index) in referralHeader"
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
                v-for="(referral, index) in referrals?.data"
                :key="referral?.id"
              >
                <td>{{ index + 1 }}</td>
                <td>₦‎ {{ referral.amount.toLocaleString() }}</td>
                <td>{{ referral?.referred.firstname }} {{ referral?.referred.lastname }}</td>
                <td>{{ referral.referred?.email }}</td>
                <td>
                  {{
                    useDateFormat(referral?.created_at, "DD, MMMM-YYYY").value
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
                    :color="status_color(referral?.paid ? 'approved' : 'pending')"
                    >{{ referral.paid? 'Completed' : 'Pending' }}</v-chip
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>
    </v-window>

    <v-dialog v-model="dialog" width="600">
      <v-card class="pa-3">
        <h3 class="text-center my-3">Asset transactions details</h3>

        <v-tabs v-model="tab_one" class="my-4" bg-color="secondary">
          <v-tab value="one">First view</v-tab>
          <v-tab value="two">Second view</v-tab>
        </v-tabs>
        <v-window v-model="tab_one">
          <v-window-item value="one">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4>Account name</h4>
                  <p>{{ single_transactions.account_name ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Account number</h4>
                  <p>{{ single_transactions.account_number ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Reference</h4>
                  <p>{{ single_transactions.reference ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Account number</h4>
                  <p>{{ single_transactions.account_number ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Status</h4>
                  <v-chip
                    label
                    class="text-capitalize font-weight-bold pa-3"
                    :color="status_color(single_transactions?.status)"
                    >{{ single_transactions?.status ?? "No data" }}</v-chip
                  >
                </div>
                <div class="mr-2">
                  <h4>Payable amount</h4>
                  <p>
                    ₦‎
                    {{ single_transactions?.payable_amount ?? "No data" }}
                  </p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Asset amount</h4>
                  <p>
                    {{ single_transactions.asset?.code ?? "No data" }}

                    {{ single_transactions.asset_amount ?? "No data" }}
                  </p>
                </div>
                <div class="mr-4">
                  <h4>Service charge</h4>
                  <p>
                    ₦‎
                    {{ single_transactions.service_charge ?? "No data" }}
                  </p>
                </div>
              </div>

              <div class="my-5">
                <v-card
                  rounded="0"
                  class="pa-5 my-3 d-flex align-center justify-between w-100"
                >
                  <div
                    v-if="single_transactions.proof !== null"
                    class="d-flex align-center justify-between w-100"
                  >
                    <v-icon icon="mdi-file-document"></v-icon>
                    <p>Transaction Receipts</p>
                  </div>
                  <v-btn
                    v-if="single_transactions.proof !== null"
                    @click="open_file(single_transactions.proof)"
                    color="secondary"
                    >View reciept</v-btn
                  >

                  <p v-else class="text-center py-4">No Transaction Receipts</p>
                </v-card>
                <!-- <v-img :src="single_transactions.proof"></v-img> -->
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="two">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4>Comments</h4>
                  <p>{{ single_transactions.comments ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Selling rate</h4>
                  <p>{{ single_transactions.rate ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Wallet address</h4>
                  <p>{{ single_transactions.wallet_address ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Trade type</h4>
                  <p>{{ single_transactions.trade_type ?? "No data" }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between my-5">
                <div>
                  <h4>Buying rate</h4>
                  <p>{{ single_transactions.asset?.buy_rate ?? "No data" }}</p>
                </div>
                <div>
                  <h4>Asset Short Code</h4>
                  <p>{{ single_transactions.asset?.code ?? "No data" }}</p>
                </div>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
        <!-- <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="500px">
      <v-card class="pa-4">
        <h3>Finance User</h3>
        <v-form class="mt-8 py-8">
          <v-select
            v-model="finance.type"
            label="Transaction Type"
            variant="outlined"
            :items="['Debit', 'Credit']"
          ></v-select>
          <v-text-field
            v-model="finance.amount"
            label="Amount"
            variant="outlined"
          ></v-text-field>
          <v-btn
            :loading="loading"
            color="primary"
            block
            @click="financeUsers(id, finance)"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="dialog4"
      v-model="dialog4"
      max-width="429px"
      min-height="476px"
    >
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog4 = false"
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
              src="../assets/images/card-placeholder.svg"
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
            <img src="../assets/images/plus-icon.svg" alt="plus icon" />
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
          @click.native="makeConfirmation(confirmationStatus), confirmationDialog = false"
          >Yes</v-btn
        >
      </v-card-actions>
    </v-card>
    </v-dialog>
    
    <v-expand-transition>
      <v-dialog v-if="dialog3" v-model="dialog3" max-width="500px" width="100%">
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
                src="../assets/images/card-placeholder.svg"
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
              <img src="../assets/images/plus-icon.svg" alt="plus icon" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../stores/user";
import { useAssetStore } from "../stores/asset";
import { useGiftCardStore } from "../stores/giftcard";
import { useWithdrawalsStore } from "../stores/withdrawals";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useDateFormat, watchDebounced } from "@vueuse/core";
import uploadImage from "@/composables/uploadImage";
const { getUsers, restoreUsers, blockUsers, getUser, financeUsers, getAllReferralsByUserID } =
  useUserStore();
const { user, filterUserById, single_user, dialog2, referrals } = storeToRefs(
  useUserStore()
);
const { allTransactions, loading, dialog } = storeToRefs(useAssetStore());
const {
  getAllAssetTransactionsByUserId,
  declineAssetTransactions,
  approveAssetTransactions,
  getSingleAssetTransactions,
  getAllAssetTransactionByDate,
  getAllAssetTransactionByReference,
  getAllAssetTransactionsStatus,
  getAllAssetTransactionByTradeType,
  filterAllAssetTransactionsByUserId,
  single_transactions,
} = useAssetStore();

const { gift_transactions, dialog3, approving, declining } = storeToRefs(useGiftCardStore());

const {
  getAllGiftCardTransaction,
  declineRequest,
  approveRequest,
  filterAllGiftCardTransactionByUserId,
  partialApproveRequest,
} = useGiftCardStore();

const { withdrawals } = storeToRefs(useWithdrawalsStore());
const { getAllWithDrawalsByUserID } = useWithdrawalsStore();

const tab = ref(null);
const tab_one = ref(null);
const route: any = useRoute();

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat().format(value);
};
const formate_text = (text: string) => {
  if (text === "partially_approved") return "Partial";
  return text;
};
const finance = reactive({
  type: "Select",
  amount: "",
});
const userDetails = ref<any>([]);

const name = ref("");
const email = ref("");
const date1 = ref("");
const date2 = ref("");
const page = ref(1);
const note = ref("");

const status = ref("");
const search = ref("");
const type = ref("");
const date = ref("");

let uploadingImage = ref<boolean>(false);
let startImage = ref<number>(1);
let totalImage = ref<number>(1);

const dialog4 = ref<boolean>(false);

const search_by_reference = () => {
  watchDebounced(
    search,
    async () => {
      await getAllAssetTransactionByReference(search.value);
    },
    { debounce: 1000, maxWait: 5000 }
  );
};

const blockUser = async (id: string) => {
  await blockUsers(id);
  await getUser(route.params.id);
  userDetails.value = { ...filterUserById.value(route.params.id) };
};

const id = ref("");
onMounted(async () => {
  await getAllReferralsByUserID(route.params.id);
  await getAllAssetTransactionsByUserId(route.params.id);
  // await getUsers(1, name.value, email.value, date1.value, date2.value);
  await getUser(route.params.id);
  userDetails.value = { ...filterUserById.value(route.params.id) };
  await filterAllGiftCardTransactionByUserId(route.params.id);
  await getAllWithDrawalsByUserID(route.params.id);
  // console.log(userDetails.value);
});
const giftcardHeader = ref([
  {
    title: "No.",
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
const withdrawalHeader = ref([
  {
    title: "No.",
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
const referralHeader = ref([
  {
    title: "No.",
  },
  {
    title: "Amount (NGN)",
  },
  {
    title: "Name",
  },
  {
    title: "Email",
  },
  {
    title: "Date and Time",
  },
  {
    title: "Status",
  },
]);
const header = ref([
  {
    title: "No",
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

const confirmationDialog = ref(false);
let confirmationID = ref("");
const confirmationStatus = ref("");
const reproof = ref<any>([]);
const previewList = ref<any>([]);

const partial_approve = reactive({
  review_amount: "",
  review_note: "",
  review_proof: <any>[],
});

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
        previewList.value.push(response.url);
        reproof.value.push(response.url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};
const removeImage = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  partial_approve.review_proof.splice(index, 1);
};
const removeImageDecline = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  reproof.value.splice(index, 1);
};

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
        previewList.value.push(response.url);
        partial_approve.review_proof.push(response.url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};


const openConfirmationDialog = (type: string, id?: any) => {
  confirmationDialog.value = true;
  confirmationID.value = id;
  confirmationStatus.value = type;
};
const makeConfirmation = async (type: string) => {
  if (type == "approve") {
    await approveRequest(confirmationID.value);
    await filterAllGiftCardTransactionByUserId(route.params.id);
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

type StatusType = "pending" | "approved" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "approved"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
const pin_status = (status: boolean) => {
  return status == true ? "green-darken-3" : "red-darken-3";
};
const active_status = (status: boolean) => {
  return status ? "red-darken-3" : "green-darken-3";
};
</script>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
