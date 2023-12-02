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
        :columns="columns"
        :rows="rows"
        row-key="id"
        :pagination="paginations"
      >
        <template #body="props">
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
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CheckoutPage",
  data() {
    return {
      loading: false, // Add loading indicator
      rows: [],
      columns: [
        {
          name: "id",
          label: "ID",
          field: "id",
          align: "center",
          sortable: true,
        },
        {
          name: "user_id",
          label: "User ID",
          field: "user_id",
          align: "left",
          sortable: true,
        },
        {
          name: "equip_name",
          label: "Equipment Name",
          field: "equip_name",
          align: "left",
          sortable: true,
        },
        {
          name: "amount",
          label: "Amount",
          field: "amount",
          align: "left",
          sortable: true,
        },
      ],
      paginations: { rowsPerPage: 7 },
    };
  },
  
  setup() {
    const loading = ref(false); // Define loading indicator
    const user_id = 123; // Replace with actual user_id

    const fetchData = async () => {
      loading.value = true;
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

        this.rows = data; // Update rows with the modified data
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors (e.g., display an error message)
      } finally {
        loading.value = false;
      }
    };

    const age = ref(0);
    return {
      val: ref(false),
      age: age,
      loading: loading, // Export loading indicator
    };
  },
  methods: {
    increase() {
      this.age += 1;
    },
    decrease() {
      this.age -= 1;
    },
  },
});
</script>

<style scoped>
/* Add your existing styles here */
</style>
