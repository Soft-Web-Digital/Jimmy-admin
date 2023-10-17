<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useAlertStore } from "../stores/alert";
import { useUserStore } from "../stores/user";
import { onMounted, computed, ref, watch } from "vue";

import { useDateFormat, watchDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
const action = useAuthStore();
const alert_action = useAlertStore();
const { loading, alerts, dialog, alert, time } = storeToRefs(useAlertStore());
const { getUsersByEmailAndId, search_users } = storeToRefs(useUserStore());
const { getUsers, searchUsers } = useUserStore();

const date = ref();
const header = ref([
  {
    title: "No.",
  },
  {
    title: "Title",
  },
  {
    title: "Creator",
  },

  {
    title: "Target user",
  },
  {
    title: "Target user count",
  },
  {
    title: "Date created",
  },
  {
    title: "Dispatched Date",
  },

  {
    title: "Status",
  },
  {
    title: "Actions",
  },
]);
const search = ref('')
const page_no = ref(1);
const status = ref("");
const dispatched_at = ref("");
const target_user = ref("");


// const filter = () => {

//   watchDebounced(
//   search,
//  async () => { 
   
//     await searchUsers(search.value)
//    },
//   { debounce: 500, maxWait: 1000 },
// )

// }
onMounted(async () => {
  await alert_action.getAlerts(
    page_no.value,
    status.value,
    target_user.value,
    dispatched_at.value
  );
  await getUsers(1);
});

const selected_option = ref("");


const channels = computed<any>({
  get() {
    return selected_option.value;
  },
  set(value) {
    if (value == "email") {
      return "email";
    } else if (value == "in_app") {
      return "in_app";
    } else return "push";
  },
});

watch(channels,() => {
  return alert.value.channels = [channels.value]
})

const reset = async () => {
  (page_no.value = 1),
    (status.value = ""),
    (target_user.value = ""),
    (dispatched_at.value = "");
  await alert_action.getAlerts(
    page_no.value,
    status.value,
    target_user.value,
    dispatched_at.value
  );
};

type status_type = "pending" | "ongoing" | "successful";
const statusColor = (status: status_type) => {
  if (status == "pending") {
    return "yellow-darken-3";
  } else if (status == "ongoing") return "light-green-darken-2";
  else return "green lighten-3";
};

const edit = ref(false);
const btnText = ref("Create Alert");

const editItem = () => {
  // alert.value = Object.assign({}, item);
  btnText.value = "Update Alert";

  dialog.value = true;
  edit.value = true;
};
const close = (item: never) => {
  dialog.value = false;
  alert.value = Object.assign(
    {},
    {
      title: "",
      body: "",
      target_user: "",
      dispatched_at: "",
      channels: [],
      users: [],
    }
  );
  btnText.value = "Create Alert";

  edit.value = false;
};
const currentDate = ref(new Date().toISOString().slice(0, 10));
</script>

<template>
  <div>
    <v-card flat class="my-4 pa-4" rounded="0">
      <div class="d-flex align-center justify-space-between w-100">
        <h4>Filter Options:</h4>
        <div>
          <v-btn @click="reset" width="200px" class="mr-4">Reset</v-btn>
          <v-btn
            @click="
              alert_action.getAlerts(
                page_no,
                status,
                target_user,
                dispatched_at
              )
            "
            width="200px"
            color="secondary"
            >Filter</v-btn
          >
        </div>
      </div>
      <v-row class="mt-3">
        <v-col cols="12" sm="6" md="4">
          <v-select
            label="Filter by Status"
            v-model="status"
            density="compact"
            :items="['Pending', 'Successful', 'Ongoing']"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="target_user"
            label="Filter by target user"
            density="compact"
            :items="['All', 'Verified', 'Specific']"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="dispatched_at"
            type="date"
            label="Filter dispatched date"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="pa-7">
      <div class="d-flex align-center justify-space-between mb-6">
        <h3>All Annoucement</h3>

        <div>
          <v-btn
            color="secondary"
            prepend-icon="mdi-email"
            @click="
              dialog = true;
              selected_option = 'email';
            "
            >Send email</v-btn
          >
          <v-btn
            color="secondary"
            prepend-icon="mdi-apps"
            @click="
              dialog = true;
              selected_option = 'in_app';
            "
            class="ml-2"
            >Send in app</v-btn
          >
          <v-btn
            color="secondary"
            prepend-icon="mdi-bell-ring-outline"
            @click="
              dialog = true;
              selected_option = 'push';
            "
            class="ml-2"
            >Send push</v-btn
          >
        </div>
      </div>

      <v-table class="my-4">
        <thead>
          <tr>
            <th
              v-for="(headings, index) in header"
              :key="index"
              class="text-left font-weight-bold"
            >
              {{ headings.title }}
            </th>
          </tr>
        </thead>
        <tbody v-if="loading == false && alerts.data?.length > 0">
          <tr v-for="(item, index) in alerts.data" :key="item?.id">
            <td>{{ index + 1 }}</td>
            <td class="font-weight-bold">{{ item?.title }}</td>
            <td class="font-weight-bold">{{ item?.creator?.email }}</td>
            <td>{{ item?.target_user }}</td>
            <td>{{ item?.target_user_count ?? "No data" }}</td>
            <!-- <td>₦‎ {{ item?.sell_max_amount }}</td> -->
            <td>
              {{
                useDateFormat(item?.created_at, "DD, MMM YYYY - hh:mm a").value
              }}
            </td>
            <td>
              {{
                useDateFormat(item?.dispatched_at, "DD, MMM YYYY - hh:mm a")
                  .value
              }}
            </td>
            <td>
              <v-chip
                label
                class="pa-2 text-capitalize"
                :color="statusColor(item?.status)"
              >
                {{ item?.status }}
              </v-chip>
            </td>
            <!-- <td>
            <v-switch @input="activationGifCardProduct(item?.id)"></v-switch>
          </td> -->
            <td>
              <v-row justify="center">
                <v-menu transition="scroll-x-transition">
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
                      @click="
                        editItem();
                        alert_action.singleAlerts(item?.id);
                      "
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Edit Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.restoreAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Restore Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.deleteAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Delete Alert </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="alert_action.dispatchAlert(item?.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Dispatch Alert </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-layout
        v-if="loading == true"
        class="align-center justify-center w-100 my-5"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
      <p
        v-if="loading == false && alerts?.length <= 0"
        class="text-center py-6"
      >
        No data available
      </p>
    </v-card>

    <v-pagination
      v-model="page_no"
      :length="alerts?.last_page"
      @next="
        alert_action.getAlerts(page_no, status, target_user, dispatched_at)
      "
      @prev="
        alert_action.getAlerts(page_no, status, target_user, dispatched_at)
      "
      @update:modelValue="
        alert_action.getAlerts(page_no, status, target_user, dispatched_at)
      "
      active-color="red"
      :start="1"
      variant="flat"
      class="mt-5"
      color="bg-secondary"
      rounded="circle"
    ></v-pagination>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <div class="d-flex align-center w-100 justify-space-between pa-7">
            <h3 class="text-h5 font-weight-bold">{{ btnText }}</h3>
            <v-btn
              @click="close"
              color="secondary"
              variant="outlined"
              icon="mdi-close"
            >
              <v-icon icon="mdi-close"></v-icon>
            </v-btn>
          </div>
          <v-card-text>
            <v-container>
              <v-form lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="alert.title"
                      variant="outlined"
                      label="Title*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="alert.body"
                      variant="outlined"
                      label="body*"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select
                      v-model="alert.target_user"
                      variant="outlined"
                      label="Target user*"
                      required
                      :items="['All', 'Verified', 'Specific']"
                    ></v-select>
                  </v-col>
                  <v-col
                    v-if="alert.target_user == 'Specific'"
                    cols="12"
                    sm="12"
                  >
                 
                    <v-autocomplete
                      :items="search_users"
                      label="Users*"
                      required
                      @input="(e)=> searchUsers(e.target.value)"
                      v-model.lazy="alert.users"
                      multiple
                      item-title="email"
                      item-value="id"
                      clearable
                      hint="This field is required"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      type="date"
                      :min="currentDate"
                      hint="Dispatch date and time must be a date after or equal to now + 5 minutes"
                      persistent-hint
                      label="Dispatch datetime"
                      placeholder="Dispatch datetime"
                      v-model="alert.dispatched_at"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      type="time"
                      :min="currentDate"
                      hint="Dispatch date and time must be a date after or equal to now + 5 minutes"
                      persistent-hint
                      label="Dispatch time"
                      placeholder="Dispatch datetime"
                      v-model="time"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="edit == true" cols="12" sm="12">
                    <v-autocomplete
                      :items="['email', 'in_app', 'push']"
                      label="Channels*"
                      required
                      multiple
                      v-model="alert.channels"
                      item-title="name"
                      item-value="id"
                      hint="This field is required"
                      persistent-hint
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
                  ? alert_action.updateAlert(alert)
                  : alert_action.createAlert(alert)
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
  </div>
</template>

<style>
.dp__input {
  padding: 15px !important;
}
</style>
