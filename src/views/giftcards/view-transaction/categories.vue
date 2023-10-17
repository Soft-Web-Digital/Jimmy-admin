<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGiftCardStore } from "@/stores/giftcard";
import "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css";
import { useDateFormat } from "@vueuse/core";

const { getSingleGifCardCategories, activationGifCardCategories,purchaseActivationGifCardCategories } = useGiftCardStore();

const { loading, approving, declining, singleGiftCard, dialog, dialog2 } =
  storeToRefs(useGiftCardStore());

const route: any = useRoute();
const  prop = defineProps({
  id:{
    type:String,
    required:true
  }
})


// const dialog2 = ref(false)

const note = ref("");
const id = ref("");
const sale_activation = ref("");
const purchase_activation = ref("");
const img = ref<string[]>([]);

const partial_approve = reactive({
  review_rate: "",
  review_note: "",
  review_proof: null,
});
// const partial_reproof = ref('')
const partial = (e: any) => {
  partial_approve.review_proof = e.target.files[0];
};

// const dialog2 = ref(false);

// const disapprove = (selected: any) => {
//   dialog.value = true;
//   id.value = selected;
// };

const view_img = (url: string) => {
  window.open(url);
};
// CHANGE STATUS COLOR

const status_color = (status: any) => {
  return status !== null ? "green-darken-3" : "red lighten-3";
};
//

const text = (status: any) => {
  if (status == null) {
    return "Not activated";
  } else {
    return "Activated";
  }
};
//
const reproof = ref("");
const get_reproof = (e: any) => {
  reproof.value = e.target.files[0];
};

const transaction_header = ref([
  {
    title: "No.",
  },
  {
    title: "Category",
  },
  {
    title: "Product",
  },
  {
    title: "Type",
  },
  {
    title: "Country",
  },
  {
    title: "Value",
  },
  {
    title: "Rate",
  },
  {
    title: "Total",
  },
]);
const visibleRef = ref(false);
const onShow = () => {
  visibleRef.value = true;
};
const indexRef = ref(0);
const onHide = () => (visibleRef.value = false);

onMounted(async () => {
  console.log(prop.id)
  await getSingleGifCardCategories(prop.id);
});
</script>

<template>
  <v-row>
    <v-btn
      class="ml-4"
      link
      size="large"
      variant="plain"
      color="grey-darken-4"
      :to="{ name: 'GiftCardCategory' }"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      GiftCard categories
    </v-btn>
    <v-col cols="12" sm="12" lg="12">
      <v-card>
        <v-toolbar color="transparent">
          <v-toolbar-title class="font-weight-medium">
            GiftCard categories
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>

        <v-row class="px-4">
          <v-col cols="12" sm="12" lg="6">
            <v-card class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-img
                cover
                height="250"
                :src="
                  singleGiftCard?.icon ??
                  ''
                "
              ></v-img>

              <v-card-item class="pa-0 mb-5">
                <v-card-title class="pa-4">GiftCard Information</v-card-title>
                <v-divider></v-divider>
                <!-- <v-card-subtitle class="ml-6 my-2">
                  <span class="mr-1">Name:</span>

                  <span class="font-weight-bold">{{singleGiftCard?.name}}</span>
                </v-card-subtitle> -->
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0 mb-3 my-2">

                 <div class="d-flex align-center flex-column">
                 <span class="mb-1 font-weight-bold">Sale activated</span>
                   <v-chip
                    label
                    size="small"
                    :color="status_color(singleGiftCard.sale_activated_at)"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3 mr-4"
                    >{{ text(singleGiftCard.sale_activated_at) }}</v-chip
                  >
                 </div>

                  <div class="d-flex align-center flex-column  ml-7">
                   <span class="mb-1 font-weight-bold">Purchase activated</span>
                    <v-chip
                      label
                      size="small"
                      :color="status_color(singleGiftCard.purchase_activated_at)"
                      density="comfortable"
                      class="text-capitalize font-weight-bold pa-3 mr-2"
                      >{{ text(singleGiftCard.purchase_activated_at) }}</v-chip
                    >
                  </div>
                </v-row>

                <div class="font-weight-normal mt-2 mb-4">
                  <strong>Gift card name:</strong>
                  <p>{{ singleGiftCard.name }}</p>
                </div>
                <div class="font-weight-normal mt-2 mb-4">
                  <strong>Sale term:</strong>
                  <p>{{ singleGiftCard.sale_term }}</p>
                </div>

                <div>
                  <h4 class="py-1">Giftcard countries:</h4>
                  <v-chip
                    v-for="country in singleGiftCard?.countries"
                    :key="country.id"
                    class="ma-1"
                    color="secondary"
                  >
                    {{ country?.name }}
                  </v-chip>
                </div>
                <div class="mt-4">
                  <h4 class="py-1">Giftcard Admins:</h4>
                  <v-chip
                    v-for="country in singleGiftCard?.admins"
                    :key="country.id"
                    class="ma-1"
                    color="secondary"
                  >
                    {{ country?.email }}
                  </v-chip>
                  <p v-if="singleGiftCard?.admins?.length <= 0">No record</p>
                </div>
              </v-card-text>

              <!-- <v-divider v-if="singleGiftCardTransaction.status == 'pending'" class="mx-4 mb-1"></v-divider>

              <v-card-actions v-if="singleGiftCardTransaction.status == 'pending'">
                    <v-btn
                    class="mr-4"
                  color="green lighten-3"
                  :loading="approving"
                  variant="tonal"
                  @click="approveRequest(singleGiftCardTransaction?.id)"
                >
                  Approve
                </v-btn>

                <v-btn
                  color="red lighten-3"
                  variant="tonal"
                  @click="disapprove(singleGiftCardTransaction?.id)"
                >
                  Decline
                </v-btn>
                <v-btn
                  color="purple lighten-3"
                  variant="tonal"
                  @click="dialog2 = true"
                >
                  Partial approval
                </v-btn>
              </v-card-actions> -->
            </v-card>
          </v-col>

          <v-col cols="12" sm="12" lg="6">
            <v-card class="my-12">
              <v-card-title>Actions</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row class="font-weight-normal mb-4">
                  <v-col cols="12" sm="6" lg="12">
            <v-switch
              density="compact"
              :flat="true"
              :value="singleGiftCard.sale_activated_at"
              v-model="singleGiftCard.sale_activated_at"
              focused
              label="Toggle Sale Activation"
              :color="singleGiftCard?.sale_activated_at == null ? '' : 'secondary'"
              @input="activationGifCardCategories(singleGiftCard?.id)"
            ></v-switch>
            <v-switch
              density="compact"
              :flat="true"
              v-model="purchase_activation"
              focused
              :value="singleGiftCard.purchase_activated_at"
              label="Toggle Purchase Activation"
              :color="singleGiftCard?.purchase_activated_at !== null ? '' : 'secondary'"
              @input="purchaseActivationGifCardCategories(singleGiftCard?.id)"
            ></v-switch>
          </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
      </v-card>
    </v-col>

    <v-dialog v-if="dialog" v-model="dialog" max-width="500px" width="100%">
      <v-card max-width="500px">
        <v-card-text>
          <h3>Decline Request</h3>
          <p>Enter Reasons for Declining this withdrawal request</p>
        </v-card-text>

        <v-container class="mt-7">
          <v-textarea
            label="Comments"
            v-model="note"
            variant="outlined"
          ></v-textarea>

          <v-file-input
            @change="get_reproof"
            hint="Optional"
            persistent-hint
            label="Review proof"
            append-inner-icon="mdi-paperclip"
            prepend-icon=""
          ></v-file-input>

          <v-btn
            color="secondary"
            class="my-5"
            block
            :loading="declining"
            @click="declineRequest(id, note, reproof)"
            >Submit</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog2 = false"
            icon="mdi-close"
            color="secondary"
            variant="text"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </div>
        <v-form class="my-10">
          <v-text-field
            prefix="₦‎"
            v-model="partial_approve.review_rate"
            type="number"
            variant="outlined"
            label="New Rate"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Note"
          ></v-textarea>
          <v-file-input
            prepend-icon=""
            variant="outlined"
            @change="partial"
            label="Proof"
          ></v-file-input>
          <v-btn
            :loading="approving"
            @click="partialApproveRequest($route.params.id, partial_approve)"
            block
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <!-- <vue-easy-lightbox
                      :visible="visibleRef"
                      :imgs="img"
                      :index="indexRef"
                      @hide="onHide"
                    ></vue-easy-lightbox> -->
  </v-row>
</template>

<style lang="scss">
.ksb-border {
  border: 1px solid #cecccc;
}
.cursor-pointer {
  cursor: pointer;
}

.vel-modal {
  z-index: 9999999999999999 !important;
}
</style>
