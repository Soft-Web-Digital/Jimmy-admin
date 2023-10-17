import { defineStore } from 'pinia';
import ksbTechApi from '../../axios';
import { permission, roles, admin } from '../../apiRoute';
import { useNotification } from '@kyvg/vue3-notification';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from './auth';
const { getAdmin } = useUserStore();

export const useRolesPermissionsStore = defineStore('roles-permissions', {
  state: () => ({
    loading: false,
    isAssigning: false,
    dialog3: false,
    dialog: false,
    roles: [],
    permissions: [],
    role: {
      name:"",
      description:"",
      permission_id:[]
    },
    assign_role_form: {
      role_id: ''
    }
  }),
  getters: {},
  actions: {
    async getAllRoles() {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(roles + '?include=permissions,usersCount', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.roles = res.data.data.roles.data;
              this.loading = false;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async getAllPermissions() {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(permission + '?do_not_paginate=' + 1, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.permissions = res.data.data.permissions;
              this.loading = false;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async createRole(role: {
      name: string;
      description: string;
      permission_id: string;
    }) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      var formData = new FormData();
      formData.append('name', role.name);
      formData.append('description', role.description);

      for (let i = 0; i < role.permission_id.length; i++) {
        formData.append('permissions[]', role.permission_id[i]);
      }

      // formData.append("name", role.name);

      try {
        await ksbTechApi
          .post(roles, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAllRoles();

              this.router.push('/roles');
              this.loading = false;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async updateRole(role: {
      id: string;
      name: string;
      description: string;
      permission_id: string;
      _method: string;
    }) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      var formData = new FormData();
      formData.append('name', role.name);
      formData.append('description', role.description);
      formData.append('_method', 'PATCH');
      for (let i = 0; i < this.role.permission_id.length; i++) {
        formData.append('permissions[]', this.role.permission_id[i]);
      }
      try {
        await ksbTechApi
          .post(roles + '/' + role.id, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAllRoles();
              this.loading = false;
              this.dialog = false;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async deleteRole(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;

      try {
        await ksbTechApi
          .delete(roles + '/' + id, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getAllRoles();
              this.loading = false;
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async assignRole(
      id: string,
      assign_role_form: {
        role_id: string;
      }
    ) {

      var formData = new FormData();
      formData.append('role_id', assign_role_form.role_id);
      formData.append('_method', 'PATCH');

      const { notify } = useNotification();
      const store = useAuthStore();
      this.isAssigning = true;

      try {
        await ksbTechApi
          .post(
            admin + '/' + id + '/role',
            formData,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              getAdmin();
              this.isAssigning = false;
              this.dialog3 = false;
              assign_role_form = {
                role_id: ''
              };
              notify({
                title: 'Success',
                text: res.data.message,
                type: 'success'
              });
            }
          );
      } catch (error: any) {
        this.isAssigning = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    }
  }
});
