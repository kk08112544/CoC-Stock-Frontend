<template>
  <q-page padding>
    <div class="text-h4 q-pb-md text-center">History of Your User id: {{ userId }}</div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <q-table
        flat
        bordered
        :rows="historyItems"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="getStatusColor(props.row.status_name)"
              text-color="white"
            >
              {{ props.row.status_name }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ListPage",

  data() {
    return {
      userId: null,
      historyItems: [],
      loading: true,
      columns: [
        { name: "id", label: "ID", align: "left", field: "id", sortable: true },
        { name: "equip_name", label: "Equipment Name", align: "left", field: "equip_name" },
        { name: "amount", label: "Amount", align: "left", field: "amount" },
        { name: "status_name", label: "Status", align: "left", field: "status_name" },
        { name: "status", label: "Status Badge", align: "left", field: "status" }, // Add new column for status badge
      ],
    };
  },

  methods: {
    getStatusColor(status) {
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
    },

    async fetchHistory() {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/history/${userId}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        this.historyItems = response.data.History.map((item, index) => ({ id: index + 1, ...item, status: item.status_name }));

        this.loading = false;
      } catch (error) {
        console.error("Error fetching history data:", error);
        this.loading = false;
      }
    },
  },

  mounted() {
    this.userId = localStorage.getItem("userId");
    this.fetchHistory();
  },
});
</script>
