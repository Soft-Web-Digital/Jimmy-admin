import { defineStore } from "pinia";
import { network, systemData } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import ksbTechApi from "../../axios";
import { useAuthStore } from "./auth";
import { useRoute } from "vue-router";

export const useNetworksStore = defineStore("networks", {
  state: () => ({
    loading: false,
    dialog: false,
    dialog2: false,
    networks: [],
    network: {
      name: "",
      wallet_address: "",
    },
    system_data:[],
    content:"",
    single_network:{}
  }),
  getters: {},
  actions: {
    async createNetworks(network_data:{
        name:string,
        wallet_address:string
    }) {
        const store = useAuthStore();
        var formData = new FormData();
    
        this.loading = true;
  
        formData.append("name", network_data.name);
        formData.append("wallet_address", network_data.wallet_address);
    
        const { notify } = useNotification();
        try {
          await ksbTechApi
            .post(network, formData, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            })
            .then(
              (res: {
                data: {
                  message: string;
                };
              }) => {
                this.loading = false;
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAllNetwork();
                this.dialog = false
              }
            );
        } catch (error:any) {
          this.loading = false;
          
         
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      },
    async editNetworks(network_data:{
        name:string,
        id:string,
        wallet_address:string
    }) {
        const store = useAuthStore();
        var formData = new FormData();
        const route  = useRoute()
        this.loading = true;
  
        formData.append("name", network_data.name);
        formData.append("wallet_address", network_data.wallet_address);
        formData.append("_method", "PATCH");
    
        const { notify } = useNotification();
        try {
          await ksbTechApi
            .post(network + '/' + network_data.id, formData, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            })
            .then(
              (res: {
                data: {
                  message: string;
                };
              }) => {
                this.loading = false;
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAllNetwork();
                this.dialog = false
              }
            );
        } catch (error:any) {
          this.loading = false;
          
         
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      },
    async deleteNetworks(id:string) {
        const store = useAuthStore();

        this.loading = true;
        const { notify } = useNotification();
        try {
          await ksbTechApi
            .delete(network + '/' + id, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            })
            .then(
              (res: {
                data: {
                  message: string;
                };
              }) => {
                this.loading = false;
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAllNetwork();
                this.dialog = false
              }
            );
        } catch (error:any) {
          this.loading = false;
          
         
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      },
    async restoreNetworks(id:string) {
        const store = useAuthStore();

        this.loading = true;
        const { notify } = useNotification();
        try {
          await ksbTechApi
            .patch(network + '/' + id + '/restore', "" , {
              headers: { 
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            })
            .then(
              (res: {
                data: {
                  message: string;
                };
              }) => {
                this.loading = false;
                notify({
                  title: "Successful",
                  text: res.data.message,
                  type: "success",
                });
                this.getAllNetwork();
                this.dialog = false
              }
            );
        } catch (error:any) {
          this.loading = false;
          
         
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      },
    async getAllNetwork(page:number = 1, name:string = '') {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(network + '?include=assetsCount' + '&page=' + page + '&per_page=100' + '&filter[name]=' + name, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { networks: any };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.networks = res.data.data.networks;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleNetwork(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(network + '/' + id + '?include=assets', {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { networks: any };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.single_network = res.data.data.network;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllSystemData() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(systemData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { system_data: any };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.system_data = res.data.data.system_data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async editSystemData(content:{id:string, content:string}) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      var formData = new FormData();
      formData.append("content", content.content);
      formData.append("_method", "PATCH");
      try {
        await ksbTechApi
          .post(systemData + '/' + content.id,formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { system_data: any };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.system_data = res.data.data.system_data;
              this.dialog2 = false
              this.getAllSystemData()
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
  },
});
