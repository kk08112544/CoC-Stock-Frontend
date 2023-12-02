<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-pb-md text-h5">Stock</div>
      <q-table
        flat
        bordered
        grid
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
      >
        <template v-slot:top>
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <img
              :src="props.row.img_url"
              alt="Equipment Image"
              style="max-width: 100%; max-height: 100px;"
            />
          </q-td>
        </template>
        <q-btn color="primary" @click="AddData">Add to Cart</q-btn>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from 'axios';
const columns = [
  { name: "img_url", label: "Image", field: "img_url"},

  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "equip_name",
    align: "center",
    label: "Title",
    field: "equip_name",
    sortable: true,
  },
  { name: "amount", label: "Amount", field: "amount" },
  { name: "description", label: "Description", field: "description" },
];

export default defineComponent({
  name: "EqPage",
  data() {
    return {
      model: null,
      name: '',
      amount: '',
      descript: '',
    };
  },
  setup() {
    const loading = ref(false);
    const filter = ref("");
    const rows = ref([]);

    const fetchData = async () => {
      loading.value = true;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          "http://localhost:3000/api/equipment/stock",
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        // stack overflow bug fixing
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          rows.value = data;
        } else {
          const textData = await response.text();
          console.warn(`Received non-JSON response: ${textData}`);
        }
      } catch (error) {
        console.error("Error fetching stock data", error);
      } finally {
        loading.value = false;
      }
    };
    const AddData = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const CartData = {
      equip_id: this.equip_id,
      user_id: this.user_id,
      amount: this.amount,
    };

    const CartResponse = await axios.post(
      'http://localhost:3000/api/cart/addCart',
      CartData,
      {
        headers: {
          'x-access-token': token,
        },
      }
    );

    console.log('Add Equipment to Cart successfully:', CartResponse.data);

    this.$router.push('/EqTeacher');
  } catch (error) {
    console.error('Error creating equipment:', error);
  }
};

    onMounted(fetchData);

    // return {
    //   columns,
    //   rows,
    //   loading,
    //   filter,
    // };
  },
});
</script>
