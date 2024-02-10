<script setup lang="ts">
import { ref, onMounted, reactive, computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";
import { useCountryStore } from "../../stores/country";
import { useGiftProductStore } from "../../stores/products";
import { useGiftCardStore } from "../../stores/giftcard";
import { useDateFormat } from "@vueuse/core";
import useFormatter from "@/composables/useFormatter";
const { countries, giftCardCategories, currencies, giftCategories } = storeToRefs(useCountryStore());
const { giftCard, loading, dialog, gift_products } = storeToRefs(useGiftProductStore());
// const { giftCard:productCard } = storeToRefs(useGiftCardStore());
const { getSingleGifCardCategories } = useGiftCardStore();
const {
  createGiftCardProduct,
  getAllGifCardProduct,
  deleteGifCardProducts,
  activationGifCardProduct,
  editGiftCardProduct,
  
} = useGiftProductStore();
const { sortItems } = useFormatter();


const gCountries = computed<any>(() => {
  return giftCategories.value.find((item:any)=> {
    if(item.id == giftCard.value.giftcard_category ){
      return item.countries
    }
    else if(item.id == giftCard.value.giftcard_category?.id){
      return item.countries
    }
   
  })
  
})

const countriez = computed(() => {
  return gCountries.value?.countries?.filter((item:any)=> {
     return item
  })
  
})


const page = ref({ title: "Gift Card Product" });
const breadcrumbs = ref([
  {
    text: "Cards",
    disabled: false,
    href: "#",
  },
  {
    text: "Products",
    disabled: true,
    href: "#",
  },
]);

const valid = ref(false);

const name = ref([(v: string) => !!v || "Giftcard name is required"]);
const giftCardCategoryHeader = reactive([
  {
    title: "No",
  },
  {
    title: "Name",
  },
  {
    title: "Country",
  },
  {
    title: "Sell Rate",
  },
  {
    title: "Sell min amount",
  },
  {
    title: "Sell max amount",
  },
  // {
  //   title: "Created at",
  // },
  {
    title: "Status",
  },
  {
    title: "Toggle activation",
  },
  {
    title: "Actions",
  },
]);
// select file
const page_no = ref(1);
// end
onMounted(async () => {
  await getAllGifCardProduct(page_no.value, product_name.value, activation_status.value);
});

const blockedStatus = (status: string | null) => {
  return status !== null ? "Activated" : "Not active";
};
const statusColor = (status: string | null) => {
  return status !== null ? "green lighten-3" : "red lighten-3";
};

const edit = ref(false);
const btnText = ref("Create Item");
const editItem = (item: never) => {
  giftCard.value = Object.assign({}, item);
  btnText.value = "Update Item";
  dialog.value = true;
  edit.value = true;
};

const close = () => {
  dialog.value = false;
  giftCard.value = Object.assign(
    {},
    {
      name: "",
      country_id: "",
      currency_id: "",
      sell_rate: "",
      sell_min_amount: "",
      sell_max_amount: "",
      giftcard_category_id: "",
      id: "",
      data: "",
      giftcard_id: "",
    }
  );
  btnText.value = "Create Item";
  edit.value = false;
};

const product_name = ref("");
const activation_status = ref("");
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div class="w-full d-flex justify-end my-3">
    <v-btn
      prepend-icon="mdi-plus"
      @click="dialog = true"
      variant="flat"
      color="secondary"
    >
      Create new giftcard product
    </v-btn>
  </div>
  <v-card flat elevation="0" rounded="0" class="my-5 pa-4">
    <v-row class="mt-3">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          label="Filter by product name"
          density="compact"
          v-model="product_name"
          variant="outlined"
          @click:clear="clearMessage"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="activation_status"
          label="Filter by activation status"
          density="compact"
          :items="['Active', 'Not active']"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn
          @click="
            getAllGifCardProduct(
              page_no,
              product_name,
              activation_status == 'Active' ? 1 : 0
            )
          "
          block
          :loading="loading"
          color="secondary"
          >Filter data</v-btn
        >
      </v-col>
    </v-row>
  </v-card>
  <v-card class="my-1">
    <v-table>
      <thead>
        <tr>
          <th
            :key="index"
            v-for="(headerTitle, index) in giftCardCategoryHeader"
            class="text-left"
          >
            {{ headerTitle.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="loading == false && gift_products?.data?.length > 0">
        <tr v-for="(item, index) in sortItems(gift_products.data)" :key="item?.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item?.name }}</td>
          <td>{{ item?.country?.name }}</td>
          <td>{{ item.sell_rate.toLocaleString() }}</td>
          <td>₦‎ {{ item.sell_min_amount.toLocaleString() }}</td>
          <td>₦‎ {{ item.sell_max_amount.toLocaleString() }}</td>
          <!-- <td>{{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}</td> -->
          <td>
            <v-chip label class="pa-2" :color="statusColor(item?.activated_at)">
              {{ blockedStatus(item?.activated_at) }}
            </v-chip>
          </td>
          <td>
            <v-switch
              :color="item?.activated_at !== null ? 'secondary' : null"
              :value="item?.activated_at"
              v-model="item.activated_at"
              @input="activationGifCardProduct(item?.id)"
            ></v-switch>
          </td>
          <td>
            <v-row justify="center">
              <v-menu transition="scroll-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn
                    text
                    icon="mdi-dots-vertical"
                    color="transparent"
                    class="ma-2"
                    v-bind="props"
                  >
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="showDetails(item?.id)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title>
                      View Category
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="editItem(item)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title>
                      Edit Category
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="deleteGifCardProducts(item?.id)"
                    link
                    color="secondary"
                  >
                    <v-list-item-title>
                      Delete Category
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-layout>

    <p
      v-if="loading == false && gift_products?.data?.length <= 0"
      class="text-center py-6"
    >
      No data available
    </p>
  </v-card>
  <v-pagination
    v-model="page_no"
    :length="gift_products?.last_page"
    @next="getAllGifCardProduct(page_no, product_name, activation_status)"
    @prev="getAllGifCardProduct(page_no, product_name, activation_status)"
    @update:modelValue="getAllGifCardProduct(page_no, product_name, activation_status)"
    active-color="red"
    :start="1"
    variant="flat"
    class="mt-5"
    color="bg-secondary"
    rounded="circle"
  ></v-pagination>

  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <h3 class="text-h5 font-weight-bold pa-7">{{ btnText }}</h3>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="giftCard.name"
                    :rules="name"
                    variant="outlined"
                    label="Giftcard product name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="giftCard.sell_rate"
                    variant="outlined"
                    label="Selling Rate*"
                    prefix="₦‎"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="giftCard.sell_min_amount"
                    variant="outlined"
                    label="Selling amount*"
                    required
                    prefix="₦‎"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="giftCard.sell_max_amount"
                    variant="outlined"
                    label="Selling Max Amount*"
                    required
                    prefix="₦‎"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-autocomplete
                   variant="outlined"
                    :items="giftCardCategories"
                    label="Giftcard categories*"
                    required
                    @update:modelValue="getSingleGifCardCategories"
                    item-title="name"
                    item-value="id"
                    v-model="giftCard.giftcard_category"
                    
                  ></v-autocomplete>
                </v-col>
                <v-col v-if="giftCard.giftcard_category" cols="12" sm="12">
                  <v-autocomplete
                    :items="countriez"
                    label="Countries*"
                    required
                     variant="outlined"
                    
                    item-title="name"
                    item-value="id"
                    v-model="giftCard.country"
                    hint="This field is required"
                    persistent-hint
                  ></v-autocomplete>
                </v-col>
                
                <v-col cols="12" sm="12">
                  <v-autocomplete
                  :items="currencies"
                   variant="outlined"
                    
                    label="Currency*"
                    required

                    v-model="giftCard.currency"
                    
                    item-title="code"
                    item-value="id"
                    
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            class="px-7"
            variant="outlined"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            :loading="loading"
            @click="
              edit == true
                ? editGiftCardProduct(giftCard)
                : createGiftCardProduct(giftCard)
            "
            color="secondary"
            class="px-12"
            variant="flat"
          >
            {{ btnText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 18px !important;
}
</style>
