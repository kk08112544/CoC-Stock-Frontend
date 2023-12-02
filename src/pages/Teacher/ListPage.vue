<template>
  <q-page padding>
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
            <q-td key="cart_id" :props="props"> {{ props.row.cart_id }}</q-td>
            <q-td key="equip_name" :props="props"> {{ props.row.equip_name }}</q-td>
            <q-td key="amount" :props="props"> {{ props.row.amount }}</q-td>
            <q-td key="status_name" :props="props"> {{ props.row.status_name }}</q-td>
          </q-tr>
        </template>
      </q-table>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent ({
  name: "ListPage",
  data() {
    return {
      dataReady: false,
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
          name: "cart_id",
          label: "Cart ID",
          field: "cart_id",
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
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "left",
          sortable: true,
        },
      ],
      paginations: { rowsPerPage: 7 },
    };
  },
  setup() {
    const fetchData = async () => {
      loading.value = true;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `http://localhost:3000/api/history/${user_id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };
  },
})

</script>
