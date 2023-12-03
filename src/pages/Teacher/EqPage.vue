<template>
  <q-page padding>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id">
        <q-img
          :src="getImageUrl(item.img_url)"
          :ratio="16/9"
          spinner-color="primary"
          spinner-size="82px"
        />
        <div>{{ item.equip_name }}</div>
        <div>{{ item.amount }}</div>
      </div>
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
      cartItems: [],
      loading: true,
    };
  },

  methods: {
    getImageUrl(img_url) {
      // Assuming your image API endpoint is '/api/file/:imgUrl'
      return `http://localhost:3000/api/file/${img_url}`;
    },
  },

  async mounted() {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`, {
        headers: {
          "x-access-token": token,
        },
      });

      this.cartItems = response.data.Cart;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loading = false;
    }
  },
});
</script>
