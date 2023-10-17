<script setup lang="ts">
import { ref } from "vue";
import LogoDark from "@/layouts/full/logo/LogoDark.vue";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
const store = useAuthStore();

const { twoFALoading, verifyTwoFALoading } = storeToRefs(useAuthStore());
const code = ref<string>('');

const verificationCode = ref([(v: string) => !!v || "Code is required"]);

const otpInput = ref<any>(null);

const handleOnComplete = (value: string) => {
  code.value = value;
};

const handleOnChange = (value: string) => {
  code.value = value;
};

const clearInput = () => {
  otpInput.value.clearInput();
};
</script>

<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center" class="h-100vh" align="center">
      <v-col lg="7" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row align="center" justify="center">
            <v-col lg="10">
              <div class="pa-7 pa-sm-12">
                <v-layout class="align-center justify-center w-full">
                  <LogoDark />
                </v-layout>
                <h2
                  class="font-weight-bold mt-4 text--darken-2 text-center my-5"
                >
                  Two Factor Authentication
                </h2>
                <h6 class="text-subtitle-1 text-grey-darken-1 text-center ma-0">
                  A verification code has been sent to your email. This code
                  will be valid for 15 minutes.
                </h6>

                <v-form action="/dashboards/analytical">
                  <div class="d-flex align-center justify-center">
                    <v-otp-input
                      ref="otpInput"
                      input-classes="otp-input"
                      separator=""
                      :num-inputs="6"
                      v-model="code"
                      :should-auto-focus="true"
                      :is-input-num="true"
                      :conditionalClass="['one', 'two', 'three', 'four']"
                      :placeholder="['*', '*', '*', '*']"
                      @on-change="handleOnChange"
                      @on-complete="handleOnComplete"
                    />
                  </div>

                  <v-layout
                    class="align-center justify-space-between w-100 flex-column"
                  >
                    <div class="my-3">
                      <p
                        class="text-subtitle-1 text-grey-darken-1 text-center ma-0"
                      >
                        It may take a minute to receive your code.
                      </p>
                      <span
                        class="text-subtitle-1 text-grey-darken-1 text-center ma-0"
                        >Haven't received it?</span
                      >
                      <span
                        @click="store.resend_two_Factor_Auth()"
                        class="ml-3 cursor-pointer"
                        >Resend a new code</span
                      >
                    </div>
                    <v-btn
                      @click="store.verify_two_Factor_Auth(code)"
                      :loading="twoFALoading"
                      color="secondary"
                      size="large"
                      class="mr-4 px-8"
                      >Submit</v-btn
                    >
                  </v-layout>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.otp-input {
  width: 80px;

  height: 50px;
  padding: 5px;
  margin: 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  outline: none;
  appearance: none;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
