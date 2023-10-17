import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { user, admin } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import downloadFile from "@/composables/filedownloader";
import { useCountryStore } from "../stores/country";
import { useNotification } from "@kyvg/vue3-notification";

interface Admin {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  avatar: string;
  id: string;
  blocked_at: boolean;
}
interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  avatar: string;
  wallet_balance: string;
  id: string;
  username: string;
}

// interface AdminDetails {
//   firstname: string,
//   lastname: string,
//   email: string,
//   country_name: string,
// }

interface State {
  user: User[];
  users: [];
  admin: Admin[];
  fund: any;
  adminDetails: any;
  id: string;
  loading: boolean;
  dialog: boolean;
  dialog2: boolean;
  single_admin: any;
  single_user: any;
  bank_info: [];
  banks: [];
  use_activity: any;
  search_users: [];
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    user: [] as User[],
    users: [],
    admin: [] as Admin[],
    loading: false,
    dialog: false,
    dialog2: false,
    use_activity: {},
    fund: {
      type: "",
      amount: "",
    },
    adminDetails: {
      firstname: "",
      lastname: "",
      email: "",
      country: "",
    },
    id: "",
    single_admin: "",
    single_user: "",
    bank_info: [],
    banks: [],
    search_users: [],
    referrals: [],
  }),
  getters: {
    filterUserById: (state) => (id: string) =>
      state.user?.data?.filter((selectedUser: any) => {
        return selectedUser["id"] == id;
      }),
    getUsersByEmailAndId: (state) =>
      state.user?.data?.map((selectedUser: any) => {
        return {
          email: selectedUser.email,
          id: selectedUser.id,
        };
      }),
    country_id() {
      const store = useCountryStore();
      return store.countries.filter((country) => {
        if (country["name"] === this.adminDetails.country_name) {
          return country;
        }
      });
    },
    toggleActivationText: (state) =>
      !state.single_admin?.blocked_at ? "block" : "restore access",
  },
  actions: {
    updateAdmin() {
      return (this.adminDetails = {
        ...this.admin.filter((user) => user["id"] == this.id),
      });
    },

    async getUsers(
      page: number = 1,
      name: string = "",
      email: string = "",
      date1: string = "",
      date2: string = ""
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            `${user}?filter[name]=${name}&filter[email]=${email}&filter[registration_date]=${date1}${
              date2 !== "" ? `,${date2}` : ""
            }&page=${page}&per_page=${"100"}`,
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
              this.loading = false;
              this.use_activity = res.data.data;
              this.user = res.data.data.users;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },

    async getAllReferralsByUserID(id: string) {
      console.log("here");
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            "admin/referrals?" + "include=referred" + "&filter[user_id]=" + id,
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
                data: { referrals: Data };
              };
            }) => {
              this.loading = false;

              this.referrals = res.data.data.referrals;
            }
          );
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    async searchUsers(email: string = "") {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(`${user}?filter[email]=${email}`, {
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
              this.loading = false;

              this.search_users = res.data.data.users.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },

    async getUser(id: string) {
      const store = useAuthStore();

      this.loading = true;
      try {
        await ksbTechApi
          .get(`/admin/users/${id}`, {
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
              this.loading = false;

              this.single_user = res.data.data.user;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAdmin() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(`${admin}?include=roles,country`, {
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
              this.loading = false;

              this.admin = res.data.data.admins.data;
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
    async getSingleAdmin(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.dialog2 = true;
      this.loading = true;
      try {
        await ksbTechApi
          .get(admin + "/" + id + "?include=country,roles,giftcardCategories", {
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
              this.loading = false;

              this.single_admin = res.data.data.admin;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async blockUsers(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .patch(user + "/" + id + "/block", "", {
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
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getUsers(1, "", "", "", "");
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async restoreUsers(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .post(user + id + "/block", "", {
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
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getUsers(1, "", "", "", "");
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async financeUsers(
      id: string,
      financeTrans: { type: string; amount: string }
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("amount", financeTrans.amount);

      try {
        await ksbTechApi
          .post(
            user +
              "/" +
              id +
              "/finance/" +
              financeTrans.type.toLocaleLowerCase(),
            formData,
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
              this.loading = false;
              this.dialog2 = false;
              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.getUsers(1, "", "", "", "");
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
    async CreateAdmin() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("country_id", this.adminDetails.country);
      formData.append("firstname", this.adminDetails.firstname);
      formData.append("lastname", this.adminDetails.lastname);
      formData.append("email", this.adminDetails.email);

      try {
        await ksbTechApi
          .post(admin, formData, {
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
              this.loading = false;
              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.dialog = false;
              this.getAdmin();
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
    async updateAdminDetails(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("country_id", this.adminDetails.country);
      formData.append("firstname", this.adminDetails.firstname);
      formData.append("lastname", this.adminDetails.lastname);
      formData.append("email", this.adminDetails.email);
      formData.append("_method", "PATCH");

      try {
        await ksbTechApi
          .post(admin + "/" + id, formData, {
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
              this.loading = false;
              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.dialog = false;
              this.getAdmin();
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

    async deleteAdmin(id: string) {
      // confirm()
      if (confirm("Are you sure you want to delete this admin user?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .delete(admin + "/" + id, {
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
                notify({
                  title: "Success",
                  text: "Admin deleted successfully",
                  type: "success",
                });
                this.getAdmin();
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },
    async restoreAdmin(id: string) {
      // confirm()
      if (confirm("Are you sure you want to restore access to this admin?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(admin + "/" + id + "/restore", "", {
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
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAdmin();
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },
    async blockAdmin(id: string) {
      // confirm()
      if (
        confirm(
          `Are you sure you want to ${this.toggleActivationText} this admin ?`
        )
      ) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(admin + "/" + id + "/block", "", {
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
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAdmin();
                this.dialog2 = false;
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },

    async getSystemBanks(page: number) {
      const store = useAuthStore();

      this.loading = true;
      try {
        await ksbTechApi
          .get(`/admin/system-bank-accounts`, {
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
              this.loading = false;
              console.log(res);
              this.bank_info = res.data.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async deleteSystemBanks(id: string) {
      const store = useAuthStore();

      if (confirm("Are you sure you want to delete this record?")) {
        this.loading = true;
        try {
          await ksbTechApi
            .delete(`/admin/system-bank-accounts/${id}`, {
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
                this.loading = false;

                this.getSystemBanks(1);
              }
            );
        } catch (error) {
          this.loading = false;
        }
      } else return;
    },
    async createSystemBanks(bank_details: {
      bank_name: string;
      account_number: number;
      account_name: string;
    }) {
      const store = useAuthStore();

      this.loading = true;
      try {
        await ksbTechApi
          .post(`/admin/system-bank-accounts`, bank_details, {
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
              this.loading = false;
              this.dialog2 = false;
              this.getSystemBanks(1);
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async updateSystemBanks(bank_details: {
      bank_name: string;
      account_number: string;
      account_name: string;
      id: string;
    }) {
      const store = useAuthStore();

      this.loading = true;

      const formData = new FormData();
      formData.append("bank_name", bank_details.bank_name);
      formData.append("account_number", bank_details.account_number);
      formData.append("account_name", bank_details.account_name);
      formData.append("_method", "PUT");

      try {
        await ksbTechApi
          .post(`/admin/system-bank-accounts/${bank_details.id}`, formData, {
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
              this.loading = false;
              this.dialog2 = false;
              this.getSystemBanks(1);
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getBanks() {
      const store = useAuthStore();

      this.loading = true;
      try {
        await ksbTechApi
          .get(`/banks?do_not_paginate=${1}`, {
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
              this.loading = false;

              this.banks = res.data.data.banks;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async exportUsers() {
      const limit = 5000;
      let offset = 0;
      let totalOffset = Math.ceil(this.user?.total / limit);
      const store = useAuthStore();
      const { notify } = useNotification();
      notify({
        title: "Export",
        text: "Preparing file to export",
        type: "info",
      });
      try {
        while (totalOffset--) {
          await ksbTechApi
            .get(user + `/export?limit=${limit}&offset=${offset}`, {
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
                downloadFile(res.data.data.path, "file downloaded");
              }
            );
          offset++;
        }
        notify({
          title: "Successful",
          text: "Users exported successfully",
          type: "success",
        });
      } catch (error: any) {
        this.loading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async blockUser(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .patch(`${user}/${id}/block`, {
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
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
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
