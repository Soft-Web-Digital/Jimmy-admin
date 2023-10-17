import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { update_profile } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from './auth'

export const useProfileStore = defineStore("profile", {
  state: () => ({
    updating:false
  }),
  getters: {},
  actions: {
   
  },
});
