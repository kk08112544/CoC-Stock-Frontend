<template>
  <q-page padding>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- Your existing template code -->

      <!-- Uncomment the data fetching part -->
      <!-- fetchData() -->
      
      <!-- Data completed -->
      <q-table
        title="List of Your Cart"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :pagination="paginations"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props"> {{ props.row.id }}</q-td>
            <q-td key="user_id" :props="props"> {{ props.row.user_id }}</q-td>
            <q-td key="equip_name" :props="props"> {{ props.row.equip_name }}</q-td>
            <q-td key="amount" :props="props"> {{ props.row.amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "CheckoutPage",
  setup() {
    const loading = ref(false); // Define loading indicator
    const rows = ref([]);
    const columns = [
      {
        name: "id",
        label: "ID",
        align: "center",
        sortable: true,
      },
      {
        name: "user_id",
        label: "User ID",
        align: "left",
        sortable: true,
      },
      {
        name: "equip_name",
        label: "Equipment Name",
        align: "left",
        sortable: true,
      },
      {
        name: "amount",
        label: "Amount",
        align: "left",
        sortable: true,
      },
    ];
    const paginations = { rowsPerPage: 7 };

    const fetchData = async () => {
      loading.value = true;
      const user_id = 123; // Replace with actual user_id
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `http://localhost:3000/api/cart/${user_id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        // Handle data and image fetching here
        // ...

        rows.value = data; // Update rows with the modified data
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors (e.g., display an error message)
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // Uncomment the line below if you want to fetch data when the component is mounted
      // fetchData();
    });

    return {
      loading,
      rows,
      columns,
      paginations,
      fetchData,
    };
  },
});
</script>

<style scoped>
/* Add your existing styles here */
</style>
