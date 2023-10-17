<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useQuery } from "vue-query";
const action = useAuthStore();
const { notificationData, updating } = storeToRefs(useAuthStore());

const notification_id = computed(() => {
  return notificationData.value.map((notice: any) => {
    return notice.id;
  });
});

const { data, isLoading } = useQuery(
  "notifications",
  async () => await action.getQueryNotifications(),
  {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime:1000
  }
);

const notification_query = computed(() => {
  return data.value?.data?.notifications?.data 
})



</script>

<template>
  <div>
    <v-card class="pa-7">
      <div class="d-flex align-center justify-space-between">
        <h3>All Notifications</h3>

        <v-btn
          color="secondary"
          prepend-icon="mdi-bell-ring-outline"
          :loading="updating"
          @click="
            notification_query?.length > 0
              ? action.markAsRead(notification_id)
              : null
          "
          >Mark all as read</v-btn
        >
      </div>
      <v-row>

      <v-col v-if="isLoading" cols="12">
        
      </v-col>
        <v-col v-if="notification_query?.length > 0" cols="12">
          <v-list >
            <v-list-item
              :active-color="item?.read_at !== null ?? 'primary'"
              class="pa-3 mt-2"
              v-for="(item, i) in notification_query"
              :key="i"
              :value="item?.id"
              rounded="lg"
            >
              <div>
                <h4 class="font-weight-bold my-3">{{ item?.data.title }}</h4>
                <p class="grey-lighten-1">{{ item?.data.body }}</p>
              </div>
            </v-list-item>
          </v-list>

          
        </v-col>
        <v-col v-else cols="12">
          <p  class="font-weight-bold text-center my-4">No data found</p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped></style>
