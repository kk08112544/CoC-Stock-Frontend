<template>
  <q-page padding>
    <div align="right" class="q-mr-sm">
      <q-btn color="primary" icon="add" label="Add" href="/add" />
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else class="flex justify-center q-pt-sm">
      <q-card v-for="item in equipment" :key="item.id" class="my-card q-mb-sm">
        <q-img
          :src="getImageUrl(item.img_url)"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
        />

        <q-card-section class="q-pa-sm">
          <div class="text-h5 text-primary">{{ item.equip_name }}</div>
          <div class="text-h6 text-warning">{{ item.amount }}</div>
          <div class="text-subtitle1">{{ item.description }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="edit" color="positive" @click="navigateToUpdatePage(item)" />
          <q-btn icon="delete" color="negative" @click="deleteItem(item)" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "StaffEqPage",

  data() {
    return {
      equipment: [],
      loading: true,
    };
  },

  methods: {
    getImageUrl(img_url) {
      return `http://localhost:3000/api/file/${img_url}`;
    },
    navigateToUpdatePage(item) {
  console.log(item);
  this.$router.push({
    name: 'update',
    params:{
      id: item.id,
    },
    query: {

      equip_name: item.equip_name,
      img_url: item.img_url,
      amount: item.amount,
      description: item.description
    }
  });
},

    async deleteItem(item) {
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("accessToken");

      try {
        await axios.delete(
          `http://localhost:3000/api/equipment/deleteEquip/${item.id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        this.equipment = this.equipment.filter((e) => e.id !== item.id);

        console.log("Item deleted successfully.");
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },

  async mounted() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipment",
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
