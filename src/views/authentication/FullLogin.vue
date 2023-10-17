<script setup lang="ts">
import LogoDark from "../../layouts/full/logo/LogoDark.vue";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { ksbTechLogin } = useAuthStore();
const router = useRouter();
const { loginLoading } = storeToRefs(useAuthStore());

const checkbox = ref(false);
const valid = ref(true);
const show1 = ref(false);
const password = ref("");
const email = ref("");

const passwordRules = ref([(v: string) => !!v || "Password is required"]);
const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);

const nextPage = () => {
  return router.push("/authentication/request-reset-code");
};
</script>

<template>
  <v-row class="h-100vh">
    <v-col
      cols="12"
      lg="5"
      xl="6"
      class="bg-secondary d-none d-md-flex align-center justify-center"
    >
    </v-col>
    <v-col cols="12" lg="7" xl="6" class="d-flex align-center">
      <v-container>
        <div class="pa-7 pa-sm-12">
          <v-row>
            <v-col cols="12" lg="9" xl="6">
              <!-- <img src="@/assets/images/logo-icon.png" /> -->
              <LogoDark />
              <h2 class="font-weight-bold mt-4 text--darken-2">Sign in</h2>
              <v-form
                @submit.prevent="
                 ksbTechLogin({ email: email, password: password }) 
                "
                validate-on="input"
                ref="form"
                v-model="valid"
                lazy-validation
                class="mt-7"
              >
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Email address"
                  class="mt-4"
                  required
                  variant="outlined"
                  type="email"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                  prepend-icon=""
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                   @click:appendInner="show1 = !show1"
                  :type="show1 ? 'text' : 'password'"
                  variant="outlined"
                 
                ></v-text-field>

                <div class="d-flex align-end justify-end mb-4 mb-sm-0">
                  <!-- <v-checkbox
                    v-model="checkbox"
                    label="Remember me?"
                    required
                    hide-details
                  ></v-checkbox> -->
                  <div class="ml-auto">
                    <p
                      @click="nextPage"
                      class="text-primary text-decoration-none cursor-pointer"
                    >
                      Forgot password?
                    </p>
                  </div>
                </div>
                <v-btn
                  color="secondary"
                  type="submit"
                  :loading="loginLoading"
                  block
                  class="mr-4 mt-3"
                  >Sign In</v-btn
                >
              </v-form>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>
