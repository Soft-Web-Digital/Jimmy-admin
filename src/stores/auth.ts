import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { useCookies } from 'vue3-cookies'
import {
  login,
  logout,
  profile,
  permissions,
  update_profile,
  two_FA,
  verify_two_FA,
  resend_two_fa,
  update_password,
  requestCode,
  verifyCodeAndEmail,
  resetPassword,
  notification,
  markAsRead,
  reset,
} from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
const COOKIE_NAME = 'authToken';

interface ksbTechAuth {
  isLoggedIn: boolean;
  loginLoading: boolean;
  LoggingOut: boolean;
  twoFALoading: boolean;
  verifyTwoFALoading: boolean;
  updating: boolean;
  user: object | any;
  userID: string;
  token: string;
  permissions: object | any;
  notification: object | any;
  twoFA: boolean;
  email: string;
  notificationModal: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): ksbTechAuth => ({
    isLoggedIn: false,
    loginLoading: false,
    LoggingOut: false,
    updating: false,
    twoFALoading: false,
    verifyTwoFALoading: false,
    user: {},
    token: "",
    permissions: [],
    notification: [],
    twoFA: false,
    email: "",
    notificationModal: false,
    userID: "",
  }),
  getters: {
    userInitials: (state) => state.user,
    notificationCount: (state) => state.notification?.length,
    notificationData: (state) =>
      state.notification?.map((notice: any) => {
        return {
          data: notice["data"],
          id: notice["id"],
        };
      }),
    // tenNotifications: (state) => state.notification?.9(0,10)
    all_permissions: (state) => state.permissions.map((items:any) => items['name']), 
    all_permissions_group: (state) => state.permissions.map((items:any) => items['group_name']), 
  },
  actions: {
    async ksbTechLogin(loginDetails: { email: string; password: string }) {
      const formData = new FormData();
      formData.append("email", loginDetails.email);
      formData.append("password", loginDetails.password);
      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(login, formData, {
            headers: {
              Accept: "application/json",
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });

              this.loginLoading = false;
              // @ts-ignore
              this.router.push("/dashboards/analytical");
              this.isLoggedIn = true;

              this.token = res.data.data.token;
              this.user = res.data.data.admin;

              const { cookies } = useCookies();
              cookies.set(COOKIE_NAME, this.token, '1d');
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechRequestCode(data: string) {
      const formData = new FormData();
      formData.append("email", data);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(requestCode, formData, {
            headers: {
              Accept: "application/json",
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });

              this.loginLoading = false;
              // @ts-ignore
              this.router.push("/authentication/reset-password");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechVerifyCode(code: any) {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("email", this.email);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(verifyCodeAndEmail, formData, {
            headers: {
              Accept: "application/json",
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              this.loginLoading = false;
              // @ts-ignore
              this.router.push("/authentication/reset-password");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechResetPassword(data: {
      email: string;
      code: any;
      password: any;
      password_confirmation: any;
    }) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("code", data.code);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(reset, formData, {
            headers: {
              Accept: "application/json",
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });

              this.loginLoading = false;

              // @ts-ignore
              this.router.push("/auth/login");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechLogout() {
      // @ts-ignore
      this.router.push("/auth/login");
      this.isLoggedIn = false;

      this.LoggingOut = false;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(logout, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            notify({
              title: "Successful",
              text: res.data.message,
              type: "success",
            });
            //  this.router.push('/auth/login');
            this.token = "";
            this.isLoggedIn = false;
            // @ts-ignore

            this.LoggingOut = false;
            console.log(res, "grgrg");

            const { cookies } = useCookies();
            cookies.remove(COOKIE_NAME);
          })
          .catch((error: any) => {
            // notify({
            //   title: "Successful",
            //   text: error.response.message,
            //   type: "error",
            // });
          });
      } catch (error: any) {
        this.LoggingOut = false;
        console.log(error.response);
      }
    },
    async two_Factor_Auth() {
      this.twoFALoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(two_FA, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            this.twoFALoading = false;
            notify({
              title: "Successful",
              text: res.data.message,
              type: "success",
            });
            this.GetProfile();
          });
      } catch (error: any) {
        this.twoFALoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async verify_two_Factor_Auth(code: string) {
      this.twoFALoading = true;

      const data = new FormData();

      data.append("code", code);

      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(verify_two_FA, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: { data: { data: { token: string }; message: string } }) => {
              // @ts-ignore
              this.router.push("/dashboards/analytical");
              this.twoFALoading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.token = res.data.data.token;
            }
          );
      } catch (error: any) {
        this.twoFALoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response?.data.message,
          type: "error",
        });
      }
    },
    async resend_two_Factor_Auth() {
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(resend_two_fa, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            notify({
              title: "Success",
              text: res.data.message,
              type: "success",
            });
          });
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async markAsRead(ids: any) {
      this.updating = true;
      const { notify } = useNotification();
      var data = new FormData();

      for (let i = 0; i < ids.length; i++) {
        data.append("notifications[]", ids[i]);
      }

      try {
        await ksbTechApi
          .post(markAsRead, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            this.updating = false;
            notify({
              title: "Success",
              text: res.data.message,
              type: "success",
            });
            this.getNotifications();
          });
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
        this.updating = false;
      }
    },
    async GetProfile() {
      try {
        await ksbTechApi
          .get(profile, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.user = res.data.data.admin;
              this.userID = res.data.data.admin.id
              this.twoFA = res.data.data.requires_two_fa;
            }
          );
      } catch (error) {
        console.log(error);
      }
    },
    async getPermissions() {
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .get(permissions, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.permissions = res?.data?.data?.permissions;
            }
          );
      } catch (error: any) {
        console.log(error);
      }
    },
    async getQueryNotifications() {
    
      const res =  await ksbTechApi.get(notification + "?filter[read]=" + 0, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });

      console.log('Fired💥💥💥');
      

      return res.data
    },
    async getNotifications() {
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .get(notification + "?filter[read]=" + 0, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.notification = res.data.data.notifications.data;
            }
          );
      } catch (error: any) {
        console.log(error);
      }
    },
    async updateProfile(file: any) {
      // this.user.avatar = file;
      const formData = new FormData();
      // formData.append("_method", 'PATCH');
      formData.append("firstname", this.user.firstname);
      formData.append("lastname", this.user.lastname);
      formData.append("email", this.user.email);
      formData.append("phone_number", this.user.phone_number);
      formData.append("avatar", file);
      formData.append("_method", "PATCH");

      this.updating = true;
      try {
        await ksbTechApi
          .post(update_profile, formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });

              this.updating = false;

              this.GetProfile();
            }
          );
      } catch (error) {
        this.updating = false;
      }
    },
    async updateAdminProfile(data: any) {

      this.updating = true;
      try {
        await ksbTechApi
          .post(update_profile, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });

              this.updating = false;

              this.GetProfile();
            }
          );
      } catch (error) {
        this.updating = false;
      }
    },
    async updatePassword(passwordDetails: object) {
      const { notify } = useNotification();
      this.updating = true;
      try {
        await ksbTechApi
          .post(update_password, passwordDetails, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
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
                text: res.data.message,
                type: "success",
              });
              this.updating = false;
            }
          );
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
        this.updating = false;
      }
    },
    viewAllNotifications() {
      this.notificationModal = true;
    },
    isAuthenticated() {
      const { cookies } = useCookies();
      const cookie = cookies.isKey(COOKIE_NAME)
      if (cookies) {
        return cookie;
      } else {
        this.token = "";
        this.isLoggedIn = false;
        // @ts-ignore

        this.LoggingOut = false;
      }
      
    },
  },
  persist: {
    storage: localStorage,
  },
});
