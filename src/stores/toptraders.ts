import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { assetTraders, giftcardTraders } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";
import { useRoute } from "vue-router";

interface State {
  loading: boolean;
  asset_traders: [];
  giftcard_traders: [];
  page: number;
  tab: number;
  status: string;
  total_giftcard_traders: number;
  total_giftcard_traded: number;
  total_asset_traded: number;
  total_asset_traders: number;
}

export const useTradersStore = defineStore("trader", {
  state: (): State => ({
    loading: false,
    asset_traders: [],
    giftcard_traders: [],
    page: 1,
    tab: 0,
    status: "",
    total_giftcard_traders: 0,
    total_giftcard_traded: 0,
    total_asset_traded: 0,
    total_asset_traders: 0,
  }),
  getters: {
    allTransactions: (state) => state.all_transactions,
    getIds: (state) =>
      state.asset.networks.map((items) => {
        return items;
      })
  },
  actions: {
    // ASSETS TRANSACTION
    async getAllAssetTraders(
      limit: number = 20,
      date_form: string = "",
      date_to: string = ""
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            assetTraders +
            "?limit=" +
            limit +
            "&from=" +
            date_form +
            "&to=" + 
            date_to,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_traders: { data: Data } };
              };
            }) => {
              this.loading = false;

              this.asset_traders = res.data.data.users;
              this.total_asset_traded = res.data.data.total_traded
              this.total_asset_traders = res.data.data.total_trades
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllGiftcardTraders(
      limit: number = 20,
      date_form: string = "",
      date_to: string = ""
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            giftcardTraders +
              "?limit=" +
              limit +
              "&from=" +
              date_form +
              "&to=" + 
              date_to,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { giftcard_traders: { data: Data } };
              };
            }) => {
              this.loading = false;

              this.giftcard_traders = res.data.data.users;
              this.total_giftcard_traded = res.data.data.total_traded_ngn
              this.total_giftcard_traders = res.data.data.total_trades
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionByDate(date: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + "?filter[creation_date]=" + date + "&include=asset", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success"
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
  }
});
