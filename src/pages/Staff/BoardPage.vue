<template>
    <q-page padding>
      <div class="q-pa-md">
        <q-table
          flat
          bordered
          title="Board"
          :rows="filteredRows"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search by Equip Name"
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
                type="text"
                label="1=pending, 2=reject, 3=accept"
                dense
                @keydown.enter="updateStatus(props.row.id, props.row.edit)"
                :pattern="[1 - 3]"
                maxlength="1"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, computed } from "vue";
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
    { name: "user_id", label: "User ID", field: "user_id", sortable: true },
    { name: "equip_name", label: "Equip Name", field: "equip_name" },
    { name: "amount", label: "Amount", field: "amount" },
    {
      name: "status_name",
      label: "Status",
      field: "status_name",
    },
    {
      name: "edit",
      label: "Update",
      field: "edit",
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
  
      const filteredRows = computed(() => {
        if (!filter.value) {
          return rows.value;
        }
        const searchQuery = filter.value.toLowerCase();
        return rows.value.filter((row) =>
          row.equip_name.toLowerCase().includes(searchQuery)
        );
      });
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        filter,
        columns,
        rows,
        getStatusColor,
        updateStatus,
        filteredRows,
      };
    },
  });
  </script>