<script setup lang="ts">
import { ref, onBeforeMount, computed, reactive, watch } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGiftCardStore } from "@/stores/giftcard";
import uploadImage from "@/composables/uploadImage";
import "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css";
import { useDateFormat } from "@vueuse/core";
import useFormatter from "@/composables/useFormatter";
const { formatCurrency, formatNumber } = useFormatter();
const prop = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const {
  declineRequest,
  approveRequest,
  getAllGiftCardTransactionByUserId,
  partialApproveRequest,
} = useGiftCardStore();

let uploadingImage = ref<boolean>(false);
let startImage = ref<number>(1);
let totalImage = ref<number>(1);
const {
  loading,
  approving,
  declining,
  singleGiftCardTransaction,
  dialog,
  dialog2,
  singleGiftcardUnit,
  relatedGiftCards,
} = storeToRefs(useGiftCardStore());

const route = useRoute();

// const dialog2 = ref(false)

const note = ref("");
const id = ref("");

const img = ref<string[]>([]);
const proofimg = ref<string[]>([]);

const partial_approve = reactive({
  review_amount: "",
  review_note: "",
  review_proof: <any>[],
});
// const partial_reproof = ref('')
const removeImage = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  partial_approve.review_proof.splice(index, 1);
};
const previewList = ref<any>([]);
const partial = ($event: any) => {
  uploadingImage.value = true;
  let count = $event.length;
  console.log($event);
  let index = 0;
  if (event) {
    totalImage.value = $event.length;
    while (count--) {
      // proofs.value.push($event[index]);
      uploadImage($event[index]).then((response) => {
        startImage.value++;
        previewList.value.push(response.url);
        partial_approve.review_proof.push(response.url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};

// CHANGE STATUS COLOR
type StatusType = "pending" | "approved" | "declined" | "partially_approved";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow-darken-3"
    : status == "approved"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : status == "partially_approved"
    ? "green lighten-3"
    : "";
};
//
type TradeType = "sell" | "buy";

const trade_color = (status: TradeType) => {
  return status === "buy"
    ? "green lighten-3"
    : status === "sell"
    ? "red lighten-3"
    : "";
};
//
const reproof = ref<any>([]);
const get_reproof = ($event: any) => {
  uploadingImage.value = true;
  let count = $event.length;
  let index = 0;
  if (event) {
    totalImage.value = $event.length;
    while (count--) {
      // proofs.value.push($event[index]);
      uploadImage($event[index]).then((response) => {
        startImage.value++;
        previewList.value.push(response.url);
        reproof.value.push(response.url);
      });
      index++;
    }
    startImage.value = 0;
    // totalImage.value = 1;
    // uploadingImage.value = false;
  }
};

const image = computed(() => {
  img.value = singleGiftCardTransaction.value?.cards.map((images: any) => {
    return images["original_url"];
  });
  return img.value;
});

const removeImageDecline = (id: any, index: number) => {
  previewList.value = previewList.value.filter((item: any) => item !== id);
  reproof.value.splice(index, 1);
};
const proofimage = computed(() => {
  proofimg.value = singleGiftCardTransaction.value?.review_proof;
  return proofimg.value;
});

const related_giftcard = ref([
  {
    title: "No.",
  },
  {
    title: "User name",
  },
  {
    title: "Category",
  },
  {
    title: "Reference No.",
  },
  {
    title: "Trade Type.",
  },

  {
    title: "Amount",
  },
  {
    title: "Date",
  },
  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);

const formate_text = (text: string) => {
  if (text === "partially_approved") return "Partial";
  return text;
};

const transaction_header = ref([
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
    title: "Units",
  },
  {
    title: "Total",
  },
]);
const visibleRef = ref(false);
const proofVisibleRef = ref(false);
const onShow = () => {
  visibleRef.value = true;
};
const onShowProof = () => {
  proofVisibleRef.value = true;
};

const indexRef = ref(0);
const proofIndexRef = ref(0);
const onHide = () => {
  visibleRef.value = false;
  proofVisibleRef.value = false;
};

console.log(route.params.id);
onBeforeMount(async () => {
  await getAllGiftCardTransactionByUserId(prop.id);
});

const refresh = async () => {
  await getAllGiftCardTransactionByUserId(prop.id);
  previewList.value = [];
  uploadingImage.value = false;
};
const confirmationDialog = ref(false);
let confirmationID = ref("");
const confirmationStatus = ref("");
const openConfirmationDialog = (type: string, id?: any) => {
  confirmationDialog.value = true;
  confirmationID.value = id;
  confirmationStatus.value = type;
};
const makeConfirmation = async (type: string) => {
  if (type == "approve") {
    await approveRequest(confirmationID.value);
    refresh();
    confirmationDialog.value = false;
  } else if (type == "decline") {
    declineRequest(confirmationID.value, note.value, reproof.value as any);
    confirmationDialog.value = false;
  } else if (type == "partial") {
    partialApproveRequest(confirmationID.value, partial_approve);
    confirmationDialog.value = false;
  }
  confirmationDialog.value = false;
};

watch([dialog, dialog2], ([newDialog, oldDialog], [newDialog2, oldDialog2]) => {
  newDialog === false && oldDialog === false ? refresh() : "";
});
</script>

<template>
  <v-dialog v-model="confirmationDialog" width="500">
    <v-card>
      <v-toolbar dark dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
          Confirm
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4 black--text"
        >Are you sure you want to
        {{
          confirmationStatus === "partial"
            ? "partially approve"
            : confirmationStatus
        }}
        this transaction?</v-card-text
      >
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="confirmationDialog = false"
          >Cancel</v-btn
        >
        <v-btn
          color="success"
          class="body-2 font-weight-bold"
          outlined
          @click.native="makeConfirmation(confirmationStatus)"
          >Yes</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-row>
    <v-btn
      class="ml-4"
      link
      size="large"
      variant="plain"
      color="grey-darken-4"
      :to="{ name: 'GiftCardTransaction' }"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      GiftCard Transactions
    </v-btn>
    <br />
    <div>
      <v-btn
        v-if="singleGiftcardUnit"
        class="ml-4 text-normal"
        link
        size="large"
        variant="plain"
        color="grey-darken-4"
        :to="{
          name: 'RelatedGiftCards',
          params: { id: singleGiftCardTransaction?.id },
        }"
      >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Back to List
      </v-btn>
    </div>

    <v-col cols="12" sm="12" lg="12">
      <v-card>
        <v-toolbar color="transparent">
          <v-toolbar-title class="font-weight-medium">
            View transaction
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card class="pa-6" rounded="0" elevation="0">
          <v-table class="ksb-border">
            <thead>
              <tr class="pa-2">
                <th
                  :key="index"
                  v-for="(headerTitle, index) in transaction_header"
                  class="text-left"
                >
                  {{ headerTitle.title }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  {{
                    singleGiftCardTransaction?.giftcard_product
                      ?.giftcard_category?.name
                  }}
                </td>
                <td>{{ singleGiftCardTransaction?.giftcard_product?.name }}</td>
                <td>{{ singleGiftCardTransaction?.trade_type }}</td>
                <td>
                  {{
                    singleGiftCardTransaction?.giftcard_product?.country?.name
                  }}
                </td>
                <td>
                  {{
                    singleGiftCardTransaction?.giftcard_product?.currency?.code
                  }}
                  <strong>{{
                    formatNumber(singleGiftCardTransaction.amount)
                  }}</strong>
                </td>
                <td>{{ singleGiftCardTransaction?.rate }}</td>
                <td>{{ singleGiftcardUnit }}</td>
                <td>1</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-row class="px-4">
          <v-col cols="12" sm="12" lg="6">
            <v-card :loading="loading" class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-item class="pa-0 mb-5">
                <v-card-title class="pa-4">GiftCard Information</v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle class="ml-6 my-2">
                  <span class="mr-1">Reference:</span>
                  <span>{{ singleGiftCardTransaction.reference }}</span>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0 mb-3">
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3 mr-4"
                    :color="status_color(singleGiftCardTransaction?.status)"
                    >{{ singleGiftCardTransaction?.status == 'partially_approved' ? 'Approved' : singleGiftCardTransaction?.status }}</v-chip
                  >
                  <v-chip
                    label
                    size="small"
                    density="comfortable"
                    class="text-capitalize font-weight-bold pa-3"
                    :color="trade_color(singleGiftCardTransaction?.trade_type)"
                    >{{ singleGiftCardTransaction?.trade_type }}</v-chip
                  >
                </v-row>
                <div class="mb-5">
                  <strong>Card type:</strong>
                  {{ singleGiftCardTransaction?.card_type }}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Payable Amount:</strong>
                  {{ formatCurrency(singleGiftCardTransaction.payable_amount) }}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Card Amount:</strong>
                  {{
                    singleGiftCardTransaction?.giftcard_product?.currency?.code
                  }}
                  <strong>{{
                    formatNumber(singleGiftCardTransaction.amount)
                  }}</strong>
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Service Charge:</strong>
                  {{ formatCurrency(((singleGiftCardTransaction.service_charge / 100) * singleGiftCardTransaction.amount) * singleGiftCardTransaction.rate) }}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Rate:</strong>
                  {{ formatCurrency(singleGiftCardTransaction.rate) }}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Date Created:</strong>
                  {{
                    useDateFormat(
                      singleGiftCardTransaction?.created_at,
                      "DD, MMM YYYY - hh:mm a"
                    ).value
                  }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last Updated:</strong>
                  {{
                    useDateFormat(
                      singleGiftCardTransaction?.updated_at,
                      "DD, MMM YYYY - hh:mm a"
                    ).value
                  }}
                </div>
                <div class="mb-4">
                  <strong>Comments:</strong>
                  {{ singleGiftCardTransaction?.comment }}
                </div>
              </v-card-text>

              <v-divider
                v-if="singleGiftCardTransaction.status == 'pending'"
                class="mx-4 mb-1"
              ></v-divider>

              <v-card-actions
                v-if="singleGiftCardTransaction.status == 'pending'"
              >
                <v-btn
                  class="mr-4"
                  color="green lighten-3"
                  :loading="approving"
                  variant="tonal"
                  @click="
                    openConfirmationDialog(
                      'approve',
                      singleGiftCardTransaction?.id
                    )
                  "
                >
                  Approve
                </v-btn>

                <v-btn
                  color="red lighten-3"
                  variant="tonal"
                  @click="
                    (dialog2 = true),
                      (confirmationID = singleGiftCardTransaction?.id)
                  "
                >
                  Decline
                </v-btn>
                <!-- <v-btn
                  color="purple lighten-3"
                  variant="tonal"
                  @click="
                    (dialog = true),
                      (confirmationID = singleGiftCardTransaction?.id)
                  "
                >
                  Partial approval
                </v-btn> -->
              </v-card-actions>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Review Information</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Review Note:</strong>
                  {{ singleGiftCardTransaction?.review_note ?? "No data" }}
                </div>
                <div class="font-weight-normal mb-5">
                  <strong>Review By:</strong>
                  <p class="my-1">
                    Email:
                    <span class="font-weight-bold">{{
                      singleGiftCardTransaction?.reviewer?.email ?? "No data"
                    }}</span>
                  </p>
                  <p>
                    Full name:
                    <span class="font-weight-bold"
                      >{{ singleGiftCardTransaction?.reviewer?.firstname }}
                      {{ singleGiftCardTransaction?.reviewer?.lastname }}</span
                    >
                  </p>
                </div>
                <!-- <div class="font-weight-normal mb-4">
                  <strong>Review Rate:</strong>
                  {{
                    formatCurrency(
                      singleGiftCardTransaction.review_amount /
                        singleGiftCardTransaction.amount
                    )
                  }}
                </div>
                <div class="font-weight-normal mb-4">
                  <strong>Review Amount:</strong>
                  {{
                    formatCurrency(singleGiftCardTransaction.review_amount) ??
                    "No data"
                  }}
                </div> -->
                <div class="font-weight-normal mb-4">
                  <strong>Review At: </strong>
                  <span v-if="singleGiftCardTransaction.reviewed_at">
                    {{
                      useDateFormat(
                        singleGiftCardTransaction?.reviewed_at,
                        "DD, MMM YYYY - hh:mm a"
                      ).value
                    }}
                  </span>
                  <span v-else> No Data</span>
                </div>
                <div
                  v-if="singleGiftCardTransaction.reviewed_at"
                  class="font-weight-normal mb-4"
                >
                  <strong>Review Proof:</strong>
                  <v-row
                    v-if="singleGiftCardTransaction?.review_proof?.length > 0"
                  >
                    <v-col
                      v-for="(
                        images, index
                      ) in singleGiftCardTransaction.review_proof"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-img
                        cover
                        width="80"
                        height="80"
                        @click="onShowProof"
                        :src="images"
                        class="cursor-pointer mt-4"
                      ></v-img>
                    </v-col>
                  </v-row>

                  <p v-else class="text-center font-weight-bold">
                    No card info
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="12" lg="6">
            <v-card :loading="loading" class="mx-auto my-12">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-item>
                <v-card-title>User Information</v-card-title>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>First name:</strong>
                  {{ singleGiftCardTransaction.user?.firstname }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Last name:</strong>
                  {{ singleGiftCardTransaction.user?.lastname }}
                </div>

                <div
                  v-if="singleGiftCardTransaction.user_id"
                  class="font-weight-normal mb-4"
                >
                  <strong class="mr-1">Email:</strong>
                  <router-link
                    :to="{
                      name: 'UserDetails',
                      params: { id: singleGiftCardTransaction.user_id },
                    }"
                  >
                    {{ singleGiftCardTransaction.user?.email }}
                  </router-link>
                </div>
              </v-card-text>

              <!-- <v-divider class="mx-4 mb-1"></v-divider> -->
            </v-card>

            <v-card>
              <v-card-title>Bank Information</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="font-weight-normal mb-4">
                  <strong>Bank name:</strong>
                  {{ singleGiftCardTransaction.bank?.name }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account name:</strong>
                  {{ singleGiftCardTransaction?.account_name }}
                </div>

                <div class="font-weight-normal mb-4">
                  <strong>Account number:</strong>
                  {{ singleGiftCardTransaction?.account_number }}
                </div>
              </v-card-text>
            </v-card>

            <v-card class="my-12">
              <v-card-title>Card Information</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div
                  v-if="singleGiftCardTransaction?.cards"
                  class="font-weight-normal mb-4"
                >
                  <strong v-if="img?.length > 0" class="mb-5"
                    >Card Image(s):</strong
                  >

                  <v-row v-if="singleGiftCardTransaction?.cards?.length > 0">
                    <v-col
                      v-for="(images, index) in singleGiftCardTransaction.cards"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-img
                        cover
                        width="80"
                        height="80"
                        @click="onShow"
                        :src="images.original_url"
                        class="cursor-pointer mt-4"
                      ></v-img>
                    </v-col>
                  </v-row>

                  <p v-else class="text-center font-weight-bold">
                    No card info
                  </p>
                </div>
                <div
                  v-if="singleGiftCardTransaction.code"
                  class="font-weight-normal mb-4"
                >
                  <strong>Code:</strong>
                  {{ singleGiftCardTransaction.code ?? "No Code" }}
                </div>

                <div
                  v-if="singleGiftCardTransaction.pin"
                  class="font-weight-normal mb-4"
                >
                  <strong>Pin:</strong>
                  {{ singleGiftCardTransaction.pin ?? "No Pin" }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog v-if="dialog2" v-model="dialog2" max-width="500px" width="100%">
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

          <label for="proof" class="cursor-pointer">
            <p class="text-black">Upload transaction proof</p>
          </label>
          <label v-if="!previewList.length" for="proof" class="cursor-pointer">
            <img
              src="@/assets/images/card-placeholder.svg"
              alt="card-placeholder"
              class="mt-3 w-full object-fill max-h-[174px] rounded-xl"
            />
          </label>
          <input
            type="file"
            multiple
            id="proof"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            @change="get_reproof(($event.target as HTMLFormElement).files)"
          />
          <div
            class="gap-5 mt-5"
            style="
              display: grid;
              grid-template-columns: repeat(4, 80px);
              gap: 12px;
            "
          >
            <div v-for="(image, index) in previewList" :key="index">
              <div style="position: relative">
                <img
                  class="w-full cursor-pointer"
                  style="height: 75px; object-fit: cover; width: 100%"
                  :src="image"
                />
                <img
                  src="@/assets/images/cancel-svgrepo-com.svg"
                  class="absolute rounded-full border border-red-700 -top-2 -right-2 bg-red-200 text-red-500 cursor-pointer"
                  style="position: absolute; right: -5px; top: -5px"
                  width="20"
                  @click="removeImageDecline(image, index)"
                />
              </div>
            </div>
          </div>
          <div v-if="uploadingImage" class="pt-3 text-center">
            <small class="p-2 block"
              >Uploaded {{ startImage }} of {{ totalImage }}...</small
            >
          </div>
          <label
            v-if="previewList.length"
            for="proof"
            class="mt-4 d-flex align-center cursor-pointer"
          >
            <img src="@/assets/images/plus-icon.svg" alt="plus icon" />
            <p class="ml-3 underline">Add more proof</p>
          </label>

          <v-btn
            color="secondary"
            class="my-5"
            block
            :loading="declining"
            @click="openConfirmationDialog('decline', confirmationID)"
            >Submit</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="429px" min-height="476px">
      <v-card class="view-dialog pa-4">
        <div class="mb-3 d-flex justify-space-between">
          <h3 class="text-justify mt-7">Partial approval</h3>
          <v-btn
            @click="dialog = false"
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
            v-model="partial_approve.review_amount"
            type="number"
            variant="outlined"
            label="Review Amount"
          ></v-text-field>
          <v-textarea
            v-model="partial_approve.review_note"
            variant="outlined"
            label="Note"
          ></v-textarea>
          <label for="proof" class="cursor-pointer">
            <p class="text-black">Upload transaction proof</p>
          </label>
          <label v-if="!previewList.length" for="proof" class="cursor-pointer">
            <img
              src="@/assets/images/card-placeholder.svg"
              alt="card-placeholder"
              class="mt-3 w-full object-fill max-h-[174px] rounded-xl"
            />
          </label>
          <input
            type="file"
            multiple
            id="proof"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            @change="partial(($event.target as HTMLFormElement).files)"
          />
          <div
            class="gap-5 mt-5"
            style="
              display: grid;
              grid-template-columns: repeat(4, 80px);
              gap: 12px;
            "
          >
            <div v-for="(image, index) in previewList" :key="index">
              <div style="position: relative">
                <img
                  class="w-full cursor-pointer"
                  style="height: 75px; object-fit: cover; width: 100%"
                  :src="image"
                />
                <img
                  src="@/assets/images/cancel-svgrepo-com.svg"
                  class="absolute rounded-full border border-red-700 -top-2 -right-2 bg-red-200 text-red-500 cursor-pointer"
                  style="position: absolute; right: -5px; top: -5px"
                  width="20"
                  @click="removeImage(image, index)"
                />
              </div>
            </div>
          </div>
          <div v-if="uploadingImage" class="pt-3 text-center">
            <small class="p-2 block"
              >Uploaded {{ startImage }} of {{ totalImage }}...</small
            >
          </div>
          <label
            v-if="previewList.length"
            for="proof"
            class="mt-4 d-flex align-center cursor-pointer"
          >
            <img src="@/assets/images/plus-icon.svg" alt="plus icon" />
            <p class="ml-3 underline">Add more proof</p>
          </label>
          <v-btn
            :loading="approving"
            @click="openConfirmationDialog('partial', confirmationID)"
            block
            class="mt-5"
            color="secondary"
            >submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="image"
      :index="indexRef"
      @hide="onHide"
    ></vue-easy-lightbox>
    <vue-easy-lightbox
      :visible="proofVisibleRef"
      :imgs="proofimage"
      :index="proofIndexRef"
      @hide="onHide"
    ></vue-easy-lightbox>
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
