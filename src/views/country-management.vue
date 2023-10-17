<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCountryStore } from "../stores/country";
const { countryMgt, loading, page } = storeToRefs(useCountryStore());
const { getCountryMgt, giftcardActivation, registrationActivation } = useCountryStore();
const countryHeader = reactive([
  {
    title: "Code.",
  },
  {
    title: "Country flag",
  },
  {
    title: "Name",
  },
  {
    title: "Giftcard Activation",
  },

  {
    title: "Registration Activation",
  },
  {
    title: "Dialing code",
  },

  {
    title: "Actions",
  },
]);

const heading = ref("Country Management");

// const page = ref(1);
const name = ref("");
const activated = ref("");
const registered = ref("");
onMounted(async () => {
  await getCountryMgt(page.value);
});

const blockedStatus = (status: string | null) => {
  return !status ? "In active" : "Active";
};
const regStatus = (status: string | null) => {
  return !status ? "In active" : "Active";
};
const statusColor = (status: string | null) => {
  return !status ? "red lighten-3" : "green lighten-3";
};

const activation_text = (status: string | null) => {
  return !status ? "Activate for giftcard" : "Deactivate for giftcard";
};
const registration_text = (status: string | null) => {
  return !status ? "Activate for registration" : "Deactivate for registration";
};
</script>

<template>
  <div>
    <h3 class="my-4">{{ heading }}</h3>
    <v-card rounded="0" class="pa-3 mb-5">
      <v-row class="mt-3">
        <v-col cols="12" sm="12" md="6" lg="3">
          <v-text-field
            v-model="name"
            placeholder="Filter by name"
            variant="outlined"
            density="compact"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="3">
          <v-select
            v-model="activated"
            :items="['In active', 'Active']"
            placeholder="Filter by registration activated"
            variant="outlined"
            density="compact"
            clearable
            label="Registration activated"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="3">
          <v-select
            v-model="registered"
            :items="['In active', 'Active']"
            placeholder="Filter by giftcard activated"
            variant="outlined"
            density="compact"
            clearable
            label="Giftcard activated"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="6" lg="3">
          <v-btn
            @click="
              getCountryMgt(
                page,
                name,
                activated == 'In active' ? 0 : 1,
                registered == 'In active' ? 0 : 1
              )
            "
            block
            color="secondary"
            >Filter</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <v-card>
      <v-table>
        <thead class="pa-2">
          <tr class="pa-2">
            <th
              :key="index"
              v-for="(headerTitle, index) in countryHeader"
              class="text-left"
            >
              {{ headerTitle.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="countries in countryMgt?.data" :key="countries.id">
            <td>{{ countries?.alpha3_code }}</td>
            <td>
              <v-avatar size="45px">
                <v-img
                  cover
                  :src="countries?.flag_url ?? 'https://via.placeholder.com/15'"
                  class="rounded-circle img-fluid"
                >
                </v-img>
              </v-avatar>
            </td>

            <td>{{ countries.name }}</td>
            <td>
              <v-chip
                label
                class="pa-2"
                :color="statusColor(countries.giftcard_activated_at)"
              >
                {{ blockedStatus(countries.giftcard_activated_at) }}
              </v-chip>
            </td>
            <td>
              <v-chip
                label
                class="pa-2"
                :color="statusColor(countries.registration_activated_at)"
              >
                {{ regStatus(countries.registration_activated_at) }}
              </v-chip>
            </td>
            <td>{{ countries.dialing_code }}</td>

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
                      @click="giftcardActivation(countries.id, page)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        {{
                          activation_text(countries.giftcard_activated_at)
                        }}</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item
                      @click="registrationActivation(countries.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        {{ registration_text(countries.registration_activated_at) }}
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
    </v-card>
    <v-pagination
      v-model="page"
      :length="countryMgt.last_page"
      @next="getCountryMgt(page, name, activated, registered)"
      @prev="getCountryMgt(page, name, activated, registered)"
      @update:modelValue="getCountryMgt(page, name, activated, registered)"
      active-color="red"
      :start="1"
      variant="flat"
      class="mt-5"
      color="bg-secondary"
      rounded="circle"
    ></v-pagination>
  </div>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
