<template>
  <q-page padding>
    <div>test</div>
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="edit" color="positive" @click="navigateToUpdatePage(item.id)" />
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
  name: "TestPage",
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
  },

  async mounted() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://localhost:3000/api/cart/2", {
        headers: {
          "x-access-token": token,
        },
      });

      this.equipment = response.data;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loading = false;
    }
  },
});
</script>


