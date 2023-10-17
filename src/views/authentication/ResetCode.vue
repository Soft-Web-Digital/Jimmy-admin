<script setup lang="ts">
import LogoDark from "@/layouts/full/logo/LogoDark.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

// import type { Ref } from 'vue'
const valid = ref(true);

// type VForm = Vue & { validate: () => boolean }

const form  = ref<HTMLFormElement>();

// const email = ref("");

const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);
const router = useRouter();
const { ksbTechRequestCode } = useAuthStore();
const { loginLoading, email } = storeToRefs(useAuthStore());

const goBack = () => {
  return router.back();
};
</script>

<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center" class="h-100vh" align="center">
      <v-col lg="5" sm="8" xl="7">
        <v-card :loading="loginLoading" class="elevation-4">
          <v-row>
            <v-col lg="12" class="pr-0">
              <div class="pa-7 pa-sm-12">
                <center>
                  <LogoDark />
                </center>

                <h2
                  class="font-weight-bold my-4 text-center blue-grey--text text--darken-2"
                >
                  Did you forgot your password?
                </h2>
                <p class="text-subtitle-2 text-center text-grey-darken-1 mb-0">
                  Enter your email address your are using for your account below
                  and we will send you a password reset link.
                </p>

                <v-form
                  @submit.prevent="
                   ksbTechRequestCode(email) 
                  "
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  class="my-5"
                >
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email address"
                    required
                    placeholder="Enter your email address"
                    variant="outlined"
                  ></v-text-field>
                  <v-btn
                    :loading="loginLoading"
                    color="secondary"
                    block
                    class="mr-4"
                    type="submit"
                    >Request code</v-btn
                  >
                </v-form>

                <center>
                  <v-btn
                    @click="goBack"
                    prepend-icon="mdi-arrow-left"
                    color="transparent"
                    flat
                    >Back to login</v-btn
                  >
                </center>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
