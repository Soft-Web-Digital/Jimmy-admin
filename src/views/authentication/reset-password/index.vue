<script setup lang="ts">
import LogoDark from "@/layouts/full/logo/LogoDark.vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth";

const checkbox = ref(false);
const valid = ref(true);
const form = ref(null);
const show1 = ref(false);
const password = ref("");
const router = useRouter();
const confirm_password = ref("");

const code: Ref<string> = ref("");

const codeRule = ref([(v: string) => !!v || "Reset code is required"]);
const newPasswordRules = ref([(v: string) => !!v || "Password is required"]);
const confirmPasswordRules = ref([
  (v: string) => !!v || "Password is required",
]);
const { ksbTechResetPassword, ksbTechVerifyCode, email } = useAuthStore();
const { loginLoading } = storeToRefs(useAuthStore());

const goBack = () => {
  return router.back();
};

const verifyCodeAndResetPassword = async () => {
  const data = {
    code: code.value,
    email: email,
    password: password.value,
    password_confirmation: confirm_password.value,
  };
  await ksbTechVerifyCode(code.value).then(async() => {
    // console.log('hello')
   await ksbTechResetPassword(data);
  });
};


const show2 = ref(false)
</script>

<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center" class="h-100vh" align="center">
      <v-col lg="5" sm="8" xl="7">
        <v-card :loading="loginLoading" class="elevation-4">
          <v-row>
            <v-col lg="12">
              <div class="pa-7 pa-sm-12">
                <center>
                  <LogoDark />
                </center>

                <h2
                  class="font-weight-bold mt-4 text-center blue-grey--text text--darken-2"
                >
                  Create new password
                </h2>
                <p class="text-subtitle-1 text-center text-grey-darken-1">
                  Your new password must be different from your previous used
                  passwords.
                </p>

                <v-form
                  @submit.prevent="
                   verifyCodeAndResetPassword() 
                  "
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  class="my-5"
                >
                  <v-text-field
                    label="Code"
                    required
                    variant="outlined"
                    type="text"
                    v-model="code"
                    :rules="codeRule"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="newPasswordRules"
                    label="New password"
                     :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                   @click:appendInner="show1 = !show1"
                  :type="show1 ? 'text' : 'password'"
                    required
                    variant="outlined"
                    
                  ></v-text-field>
                  <v-text-field
                    v-model="confirm_password"
                    :rules="confirmPasswordRules"
                    label="Confirm new password"
                    required
                    variant="outlined"
                    :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                   @click:appendInner="show2 = !show2"
                  :type="show2 ? 'text' : 'password'"
                  ></v-text-field>
                  <v-btn
                    :loading="loginLoading"
                    color="secondary"
                    block
                    class="mr-4"
                    type="submit"
                    >Submit</v-btn
                  >
                </v-form>

                <center>
                  <v-btn @click="goBack" prepend-icon="mdi-arrow-left" color="transparent" flat
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


<!-- countries not returning when editing admin -->
<!-- text should be more that 20 characters -->
<!-- sub admins should not see dashboard

format characters
 -->