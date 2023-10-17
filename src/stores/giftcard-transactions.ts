import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { giftCard } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";

export const useGiftCardTransactionsStore = defineStore(
  "giftcard-transactions",
  {
    actions: {
      async giftCardTransaction(
        status: string,
        trade_type: string = "",
        page: number = 1,
        date1: string = "",
        date2: string = "",
        reference: string = " "
      ) {
        const store = useAuthStore();
        const data = await ksbTechApi.get(
          `giftCard 
                ?per_page=100
                &include=user,giftcardProduct
                &status=${status}
                &filter[reference]=${reference}
                &filter[trade_type]=${trade_type.toLowerCase()}
                &page=${page}
                &filter[creation_date]=${date1}${
            date2 !== "" ? "," + date2 : ""
          }`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`
            }
          }
        );
        return data;
      },

      async singleGiftCardTransaction(id: string) {
        const store = useAuthStore();
        const data = await ksbTechApi.get(
          `${giftCard}/${id}?include=user,bank,giftcardProduct,reviewer`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`
            }
          }
        );
        return data;
      },

      async approveGiftCardTransactionRequest(id: string, page: number) {
        const store = useAuthStore();

        var formdata = new FormData();
        formdata.append("complete_approval", "1");
        formdata.append("_method", "PATCH");

        const data = await ksbTechApi.post(`giftCard/${id}/approve`, formdata, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`
          }
        });
        return data;
      },

      async partialApproveRequest(id: string, data: any) {
        const store = useAuthStore();
        var formdata = new FormData();
        formdata.append("complete_approval", "0");
        formdata.append("review_rate", data.review_rate);
        formdata.append("review_note", data.review_note);
        formdata.append("review_proof", data.review_proof);
        formdata.append("_method", "PATCH");

        const res = await ksbTechApi.post(
          giftCard + "/" + id + "/approve",
          formdata,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`
            }
          }
        );

        return res;
      },
      async declineRequest(
        id: string,
        note: string,
        reproof: File,
        page: number
      ) {
        const store = useAuthStore();
        const { notify } = useNotification();

        var formdata = new FormData();
        formdata.append("review_note", note);
        formdata.append("_method", "PATCH");
        formdata.append("review_proof", reproof);

        const data = await ksbTechApi.post(
          giftCard + "/" + id + "/decline",
          formdata,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`
            }
          }
        );

        return data;
      }
    }
  }
);
