<template>
  <RouterView></RouterView>
  <VueQueryDevTools />
  <notifications  width="400" position="top right" class="mt-4" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import {VueQueryDevTools} from 'vue-query/devtools'
</script>
