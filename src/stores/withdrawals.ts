import { defineStore } from "pinia";

import ksbTechApi from "../../axios";
import { withdrawals, transaction_count } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "@kyvg/vue3-notification";

interface Data {
  id: string;
  amount: string;
  created_at: string;
  status: string;
}

interface State {
  withdrawal: any;
  loading: boolean;
  disapproving: boolean;
  approving: boolean;
  singleWithdrawal: any;
  dialog: boolean;

  transactions: any;
}

export const useWithdrawalsStore = defineStore("withdrawals", {
  state: (): State => ({
    withdrawal: {},
    loading: false,
    disapproving: false,
    approving: false,
    singleWithdrawal: {},
    dialog: false,
    transactions: {},
  }),
  getters: {
    withdrawals: (state) => state.withdrawal,
    withdrawals_total: (state) => state.transactions?.wallet_transactions?.map((item:any) => {
      return {
        total_completed_transactions_amount: item['total_completed_transactions_amount'],
        total_completed_transactions_count: item['total_completed_transactions_count'],
        total_declined_transactions_count: item['total_declined_transactions_count'],
        total_pending_transactions_count:item['total_pending_transactions_count']
      }
    }),
    giftcard_total: (state) => state.transactions?.giftcards?.map((item:any) => {
      return {
        total_approved_transactions_amount: item['total_approved_transactions_amount'],
        total_approved_transactions_count: item['total_approved_transactions_count'],
        total_declined_transactions_count: item['total_declined_transactions_count'],
        total_pending_transactions_count:item['total_pending_transactions_count'],
        total_partially_approved_transactions_count:item['total_partially_approved_transactions_count'],
      }
    }),
 
    asset_total: (state) => state.transactions?.asset_transactions?.map((item:any) => {
      return {
        total_approved_transactions_amount: item['total_approved_transactions_amount'],
        total_approved_transactions_count: item['total_approved_transactions_count'],
        total_declined_transactions_count: item['total_declined_transactions_count'],
        total_pending_transactions_count:item['total_pending_transactions_count'],
        total_partially_approved_transactions_count:item['total_partially_approved_transactions_count'],
        total_transferred_transactions_count:item['total_transferred_transactions_count'],
      }
    })
  },
  actions: {
    async getAllTransactionCount() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(transaction_count, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data:any
              };
            }) => {
              this.loading = false;

              this.transactions = res.data.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllWithDrawals(status: string, page_no: number) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            withdrawals +
              "?include=" +
              "user" +
              "&page=" +
              page_no +
              "&filter[status]=" +
              status +
              "&per_page=100",
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transactions: Data };
              };
            }) => {
              this.loading = false;

              this.withdrawal = res.data.data.wallet_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllWithDrawalsByUserID(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            withdrawals +
              "?include=" +
              "user" +
              "&filter[user_id]=" +
              id,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transactions: Data };
              };
            }) => {
              this.loading = false;

              this.withdrawal = res.data.data.wallet_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async filterWithDrawalsByDateCreated(data_created: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(withdrawals + "?sort=" + data_created, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transactions: Data };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.withdrawal = res.data.data.wallet_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleWithDrawals(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();

      try {
        await ksbTechApi
          .get(withdrawals + "/" + id, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transaction: object };
              };
            }) => {
              this.singleWithdrawal = res.data.data.wallet_transaction;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async approveRequest(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      var formData = new FormData();

      formData.append("_method", "PATCH");
      try {
        await ksbTechApi
          .post(withdrawals + "/" + id + "/approve", formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.approving = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals("pending", 1);
              this.dialog = false;
            }
          );
      } catch (error: any) {
        this.approving = false;
        this.dialog = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async declineRequest(id: string, note: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.disapproving = true;

      var formData = new FormData();
      formData.append("note", note);
      try {
        await ksbTechApi
          .patch(withdrawals + "/" + id + "/decline", formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.disapproving = false;
              this.dialog = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals("pending", 1);
            }
          );
      } catch (error: any) {
        this.disapproving = false;
        this.dialog = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
  },
});

// https://flexy-vue3-main-admin.vercel.app/ui-components/cards
// https://flexy-vue3-main-admin.vercel.app/ui-components/tabs
// https://flexy-vue3-main-admin.vercel.app/ui-components/dividers
