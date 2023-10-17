<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useDateFormat } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { useRolesPermissionsStore } from "../../stores/roles-permissions"
const {
  getAllRoles,
  getAllPermissions,
  createRole,
  updateRole,
  deleteRole
} = useRolesPermissionsStore()

const { roles, permissions, loading, dialog, role } = storeToRefs(
  useRolesPermissionsStore()
)
const tab = ref(null)

const role_header = ref([
  {
    title: "No."
  },
  {
    title: "name"
  },
  {
    title: "Permission count"
  },
  {
    title: "Description"
  },
  {
    title: "Date created"
  },
  {
    title: "Actions"
  }
])
const permission_header = ref([
  {
    title: "No."
  },
  {
    title: "name"
  },
  {
    title: "Guard name"
  },
  {
    title: "Group name"
  },
  {
    title: "Description"
  },
  {
    title: "Date created"
  }
])

onMounted(async () => {
  await getAllRoles()
  await getAllPermissions()
})

const edit = ref(false)

const btnText = ref("Create Role")
const editItem = (item: any) => {
  role.value = {
    id: item.id,
    name: item.name,
    guard_name: item.guard_name,
    description: item.description,
    users_count: item.users_count,
    permissions: item.permissions,
    permission_id: item.permissions.map((item: any) => item.id)
  }
  btnText.value = "Update Role"
  dialog.value = true
  edit.value = true
}

const close = () => {
  role.value = Object.assign(
    {},
    {
      name: "",
      description: "",
      permission_id: []
    }
  )

  dialog.value = true
}
</script>

<template>
  <h2 class="my-5">Roles and Permissions</h2>
  <v-card>
    <v-tabs v-model="tab" bg-color="secondary">
      <v-tab value="one">All Roles</v-tab>
      <v-tab value="two">All Permissions</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <div class="d-flex justify-end w-100">
            <v-btn @click="$router.push('/roles/create-role')" color="secondary"
              >Create a Role</v-btn
            >
          </div>
          <v-table>
            <thead>
              <tr>
                <th
                  v-for="(headings, index) in role_header"
                  :key="index"
                  class="text-left font-weight-bold"
                >
                  {{ headings.title }}
                </th>
              </tr>
            </thead>
            <tbody v-if="loading == false && roles?.length > 0">
              <tr class="pa-3" v-for="(data, index) in roles" :key="data?.id">
                <td>{{ index + 1 }}</td>
                <td class="text-capitalize font-weight-bold">
                  {{ data?.name }}
                </td>
                <td>{{ data?.permissions.length }}</td>
                <!-- <td>{{ data?.group_name }}</td> -->
                <td>{{ data?.description }}</td>
                <td>
                  {{ useDateFormat(data?.created_at, 'DD, MMMM-YYYY').value }}
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
                        <v-list-item @click="editItem(data)" link color="secondary">
                          <v-list-item-title> Update Role </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteRole(data?.id)" link color="secondary">
                          <v-list-item-title> Delete Role </v-list-item-title>
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
          <p v-if="loading == false && roles?.length <= 0" class="text-center py-6">
            No data available
          </p>
        </v-window-item>

        <v-window-item value="two">
          <v-table>
            <thead>
              <tr>
                <th
                  v-for="(headings, index) in permission_header"
                  :key="index"
                  class="text-left font-weight-bold"
                >
                  {{ headings.title }}
                </th>
              </tr>
            </thead>
            <tbody v-if="permissions?.length > 0">
              <tr class="pa-3" v-for="(data, index) in permissions" :key="data?.id">
                <td>{{ index + 1 }}</td>
                <td class="text-capitalize font-weight-bold">
                  {{ data?.name }}
                </td>
                <td>{{ data?.guard_name }}</td>
                <td>{{ data?.group_name }}</td>
                <td>{{ data?.description }}</td>
                <td>
                  {{ useDateFormat(data?.created_at, 'DD, MMMM-YYYY').value }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-layout v-if="loading == true" class="align-center justify-center w-100 my-5">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <p v-if="loading == false && permissions?.length <= 0" class="text-center py-6">
            No data available
          </p>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <h3>{{ btnText }}</h3>
        <v-form class="mt-8 py-8">
          <v-text-field
            v-model="role.name"
            label="Name"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="role.description"
            label="Description"
            variant="outlined"
          ></v-textarea>
          <v-autocomplete
            v-model="role.permission_id"
            variant="outlined"
            label="Permissions"
            item-title="name"
            multiple
            chips
            item-value="id"
            :items="permissions"
          ></v-autocomplete>
          <v-btn
            :loading="loading"
            color="secondary"
            block
            @click="edit == true ? updateRole(role) : createRole(role)"
            >Submit</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
