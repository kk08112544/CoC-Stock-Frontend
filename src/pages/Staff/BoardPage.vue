<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Board"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status_name="props">
          <q-td :props="props">
            <q-badge
              :color="getStatusColor(props.row.status_name)"
              text-color="white"
            >
              {{ props.row.status_name }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-input
              v-model="props.row.edit"
              type="number"
              dense
              @keydown.enter="updateStatus(props.row.id, props.row.edit)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="form_edit" persistent>
    <q-card>
      <q-card-section>
        <!-- Input fields for updating equipment data -->
        <q-input
          v-model="input.equip_name"
          label="Title"
          outlined
        />
        <q-input
          v-model="input.amount"
          label="Amount"
          outlined
        />
        <q-input
          v-model="input.description"
          label="Description"
          outlined
        />
        <q-upload
          v-model="uploadFile"
          label="Image Upload"
          outlined
          accept=".jpg, .jpeg, .png"
          @failed="onUploadFailed"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-upload>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" color="primary" @click="form_edit = false" />
        <q-btn label="Update" color="negative" @click="handleUpdate" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog -->
  <q-dialog v-model="showDialog" persistent>
    <q-card>
      <q-card-section class="text-h6">
        <q-icon :name="dialog.icon" :color="dialog.iconColor" />
        {{ dialog.msg }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :color="dialog.btnType" label="OK" @click="showDialog = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

const columns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  { name: "cart_id", label: "Card ID", field: "cart_id", sortable: true },
  { name: "user_id", label: "User ID", field: "user_id" },
  { name: "equip_name", label: "Equip ID", field: "equip_name" },
  { name: "amount", label: "Amount", field: "amount" },
  {
    name: "status_name",
    label: "Status",
    field: "status_name",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "edit",
    label: "Update",
    field: "edit",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

export default defineComponent({
  name: "BoardPage",
  setup() {
    const filter = ref(null);
    const rows = ref([]);
    const getStatusColor = (status) => {
      const lowerCaseStatus = status.toLowerCase();

      if (lowerCaseStatus === "rejected") {
        return "red";
      } else if (lowerCaseStatus === "pending") {
        return "orange";
      } else if (lowerCaseStatus === "accept") {
        return "green";
      } else {
        return "gray";
      }
    };

    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/management/",
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        rows.value = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const updateStatus = async (id, newStatus) => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.put(
          `http://localhost:3000/api/management/update/${id}`,
          { status_id: newStatus },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        console.log("Update Status Response:", response.data);
        window.location.reload();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      filter,
      columns,
      rows,
      getStatusColor,
      updateStatus,
    };
  },
});
</script>
