<!-- <template>
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
</script> -->
<template>
  <q-page padding>
    <!-- <div align="right" class="q-mr-sm">
      <q-btn color="primary" icon="add" label="Add" href="/add" />
    </div> -->
    <div v-if="loading">Loading...</div>
    <div v-else class="flex justify-center q-pt-sm" @submit="onSubmit">
      <q-card v-for="item in equipment" :key="item.id" class="my-card q-mb-sm">
        <q-img
          :src="getImageUrl(item.img_url)"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
        />

        <q-card-section class="q-pa-sm">
          <div class="text-h5 text-primary">{{ item.id }}</div>
          <div class="text-h5 text-primary">{{ item.equip_name }}</div>
          <div class="text-h6 text-warning">{{ item.amount }}</div>
          <div class="text-subtitle1">{{ item.description }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="shopping_cart" color="positive" type="submit" />
  <!-- <q-btn icon="delete" color="negative" @click="deleteItem(item)" /> -->
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "EqPage",

  data() {
    return {
      equipment: [],
      loading: true,
      model: null,
      user_id:'',
      id: '',
      amount: '',
      //description: '',
    };
  },

  methods: {
    getImageUrl(img_url) {
      return `http://localhost:3000/api/file/${img_url}`;
    },
    navigateToUpdatePage(itemId) {
      this.$router.push({ name: 'update', params: { id: itemId } });
    },

    // async deleteItem(item) {
    //   const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    //   if (!confirmDelete) return;

    //   const token = localStorage.getItem("accessToken");

    //   try {
    //     await axios.delete(
    //       `http://localhost:3000/api/equipment/deleteEquip/${item.id}`,
    //       {
    //         headers: {
    //           "x-access-token": token,
    //         },
    //       }
    //     );

    //     this.equipment = this.equipment.filter((e) => e.id !== item.id);

    //     console.log("Item deleted successfully.");
    //   } catch (error) {
    //     console.error("Error deleting item:", error);
    //   }
    // },
  },

  async mounted() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipment/stock",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      this.equipment = response.data;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loading = false;
    }
  },

  async onSubmit(){
    try{
      const AddToCart = {
          equip_id: this.id,
          user_id: this.user_id,
          amount: this.amount,
      };
      const token = localStorage.getItem("accessToken");
      const addCartResponse = await axios.post('http://localhost:3000/api/cart/addCart',AddToCart, {
          headers: {
            "x-access-token": token,
          },
      });
      this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Add to Cart Successfully",
      });
      this.$router.push("/EqTeacher");
    }catch (error) {
        console.log("Add to Cart error", error);

        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: "Add to Cart failed",
        });
    }
    

  }
});
</script>

<style scoped>
.my-card {
  width: 185px;
  max-width: 250px;
  display: inline-block;
  margin-right: 10px;
}
</style>
