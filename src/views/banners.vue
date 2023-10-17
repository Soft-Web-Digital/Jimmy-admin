<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { ref } from "vue";
import { useBannersStore } from "../stores/banners";
import { useDateFormat } from "@vueuse/core";
import VueEasyLightbox from "vue-easy-lightbox";
import { useNotification } from "@kyvg/vue3-notification";
import "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css";

const { notify } = useNotification();
const queryClient = useQueryClient()

// functions from pinia store
const {
  getAllBanners,
  getSingleBanner,
  uploadBanners,
  deleteBanners,
  toggleBannerActivation,
} = useBannersStore();
// end

// get all banners
const { data, isLoading, isError, isFetching, refetch } = useQuery(
  "get-banners",
  getAllBanners,
  {
    refetchOnWindowFocus: false,
    staleTime: 100000,
    retry: 4,
    select: (data) => {
      const banners = data.data?.data?.banners?.data;
      return banners;
    },
  }
);
// end

// get single banner
const banner_id = ref<string>("");
const single_banner = ref([]);
const dialog2 = ref(false);
const visibleRef = ref(false);
const onShow = () => {
  visibleRef.value = true;
};
const indexRef = ref(0);
const onHide = () => (visibleRef.value = false);

const { data: banner, refetch: fetchBanner } = useQuery(
  ["single-banner", banner_id.value],
  () => getSingleBanner(banner_id.value),
  {
    enabled: false,
    staleTime: 100000,
    retry: 4,
    onSuccess: (data) => {
      onShow();
    },
    onError: (error) => {
      console.log(data);
    },
    select(banner) {
      let val = [];
      val.push(
        banner?.data?.data?.banner?.featured_image,
        banner?.data.data?.banner?.preview_image
      );
      return val;
    },
  }
);
// end

// Create banners
const dialog = ref(false);
const preview_image = ref<any>(null);
const featured_image = ref<any>(null);

const { isLoading: uploading, mutate } = useMutation(
  (data: { preview_image: string; featured_image: string }) =>
    uploadBanners(data),
  {
    onSuccess: () => {
      dialog.value = false;
      preview_image.value = null;
      featured_image.value = null;
      queryClient.invalidateQueries('get-banners')
    },
    onError: (error: any) => {
      uploading.value = false;
      notify({
        type: "error",
        title: "Success",
        text: error?.message,
      });
    },
  }
);
const create_banner = async (data: any) => {
  await mutate(data);
};
// end

// toggle banners

const { mutate: handleToggle } = useMutation(
  (id: string) => toggleBannerActivation(id),
  {
    onSuccess(data) {
      notify({
        type: "success",
        title: "Success",
        text: data?.message,
      });
      queryClient.invalidateQueries('get-banners')
    },
  }
);

const toggle_item = async (id: string, isActive: boolean) => {
  if (
    confirm(
      `Are you sure you want to ${
        isActive == false ? "Activate" : "Deactivate"
      } this banner?`
    )
  ) {
    await handleToggle(id);
  }
};

// end

// delete banners

const { mutate: handleDelete } = useMutation(
  (id: string) => deleteBanners(id),
  {
    onSuccess(data) {
      notify({
        type: "success",
        title: "Success",
        text: data?.data?.message,
      });
     queryClient.invalidateQueries('get-banners')
    },
  }
);

const delete_item = async (id: string) => {
  if (confirm("Are you sure you want to delete this banner?")) {
    await handleDelete(id);
  }
};

// end

// handle image files
const image_one = (e: any) => {
  preview_image.value = e.target.files[0];
};
const image_two = (e: any) => {
  featured_image.value = e.target.files[0];
};
// end

// utility functions
const blockedStatus = (status: string | null) => {
  return status !== null ? "Activated" : "Not active";
};
const statusColor = (status: string | null) => {
  return status !== null ? "green lighten-3" : "black lighten-3";
};
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <h2>Banners</h2>
      <v-btn @click="dialog = true" color="secondary">Create banners</v-btn>
    </div>

    <v-card class="mt-6">
      <v-table>
        <thead>
          <tr>
            <th>No</th>
            <th>Admin</th>
            <th>Preview image</th>
            <th>Featured image</th>
            <th>Created at</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(
              {
                id,
                admin,
                featured_image,
                preview_image,
                created_at,
                activated_at,
              },
              index
            ) in data"
            :key="id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ admin.firstname }} {{ admin.lastname }}</td>
            <td>
              <v-img width="40px" :src="featured_image"></v-img>
            </td>
            <td>
              <v-img width="40px" :src="preview_image"></v-img>
            </td>

            <td>
              {{ useDateFormat(created_at, "DD, MMM YYYY - hh:mm a").value }}
            </td>

            <td>
              <v-chip :color="statusColor(activated_at)">{{
                blockedStatus(activated_at)
              }}</v-chip>
            </td>

            <td>
              <v-row>
                <v-menu transition="scroll-y-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      text
                      icon="mdi-dots-vertical"
                      color="transparent"
                      v-bind="props"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="fetchBanner((banner_id = id))"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> View Banner </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="
                        toggle_item(id, activated_at !== null ? true : false)
                      "
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        Toggle Banner Activation
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="delete_item(id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title> Delete Banner </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>

      <p
        v-if="data?.length <= 0 && isLoading == false && isFetching == false"
        class="py-7 text-center font-weight-bold"
      >
        No data available
      </p>

      <v-layout
        v-if="isLoading == true && isFetching == true"
        class="align-center justify-center w-100 my-5"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>

      <p v-else-if="isError">An error occurred</p>
    </v-card>

    <v-pagination
      class="my-7"
      variant="flat"
      color="secondary"
      rounded="circle"
    ></v-pagination>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <h3>Select banners for upload</h3>
        <v-form class="mt-8 py-8">
          <v-file-input
            @change="image_one"
            label="Preview image"
            variant="outlined"
            prepend-icon=""
            append-inner-icon="mdi-paperclip"
          ></v-file-input>
          <v-file-input
            @change="image_two"
            label="Featured image"
            variant="outlined"
            prepend-icon=""
            append-inner-icon="mdi-paperclip"
          ></v-file-input>
          <v-btn
            :loading="uploading"
            @click="
              create_banner({
                preview_image: preview_image,
                featured_image: featured_image,
              })
            "
            color="secondary"
            block
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="banner"
      :index="indexRef"
      @hide="onHide"
    ></vue-easy-lightbox>
  </div>
</template>
