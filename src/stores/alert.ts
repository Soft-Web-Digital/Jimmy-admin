import { defineStore } from "pinia";

import ksbTechApi from "../../axios";
import { alert } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";

interface Payload {
  id: string;
  title: string;
  body: string;
  target_user: string;
  dispatched_at: string;
  channels: [];
  users: [];
}

export const useAlertStore = defineStore("alert", {
  state: () => ({
    loading: false,
    dialog: false,
    alerts: [],
    alert: {
      title: "",
      body: "",
      target_user: "",
      dispatched_at: "",
      channels: [],
      users: [],
    },
    time: "",
  }),
  getters: {},
  actions: {
    async getAlerts(
      page: number = 1,
      status: string = "",
      target: string = "",
      date: string = ""
    ) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            alert +
              "?page=" +
              page +
              "&filter[status]=" +
              status.toLowerCase() +
              "&filter[target_user]=" +
              target.toLowerCase() +
              "&filter[dispatch_date]=" +
              date + '&include=creator',
              
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
                data: any;
              };
            }) => {
              this.alerts = res.data.data.alerts;
              this.loading = false;
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
    async singleAlerts(
      uuid:string
    ) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            `${alert}/${uuid}`,
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
                data: any;
              };
            }) => {
              this.alert = res.data.data.alert;
              this.loading = false;
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

    async createAlert(alerts: Payload) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      var formData = new FormData();
      formData.append("title", alerts.title);
      formData.append("body", alerts.body);
      formData.append("target_user", alerts.target_user.toLowerCase());
      formData.append(
        "dispatch_datetime",
        alerts.dispatched_at + " " + this.time
      );
      // formData.append("target_user", alert.target_user);

      const emails = alerts.channels;
      const users = alerts.users;

      for (let i = 0; i < emails.length; i++) {
        formData.append("channels[]", emails[i]);
      }
      for (let i = 0; i < users.length; i++) {
        formData.append("users[]", users[i]);
      }

      // formData.append("name", role.name);

      try {
        await ksbTechApi
          .post(alert, formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.dialog = false;

              this.alert = Object.assign(
                {},
                {
                  title: "",
                  body: "",
                  target_user: "",
                  dispatched_at: "",
                  channels: [],
                  users: [],
                }
              );

              this.getAlerts();
              this.loading = false;
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
    async updateAlert(alerts: Payload) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      var formData = new FormData();
      formData.append("title", alerts.title);
      !alerts.body ? null : formData.append("body", alerts.body);
      formData.append("target_user", alerts.target_user.toLowerCase());
      formData.append(
        "dispatch_datetime",
        alerts.dispatched_at + " " + this.time
      );

      formData.append("_method", "PATCH");
      try {
        await ksbTechApi
          .post(alert + "/" + alerts.id, formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAlerts();
              this.loading = false;
              this.dialog = false;
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
    async deleteAlert(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      try {
        await ksbTechApi
          .delete(alert + "/" + id, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAlerts();
              this.loading = false;
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
    async restoreAlert(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      try {
        await ksbTechApi
          .patch(alert + "/" + id + "/restore", "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAlerts();
              this.loading = false;
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
    async dispatchAlert(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      try {
        await ksbTechApi
          .post(alert + "/" + id + "/dispatch", "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAlerts();
              this.loading = false;
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
  },
});
