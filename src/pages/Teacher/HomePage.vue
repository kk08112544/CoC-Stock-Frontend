<template>
  <q-page padding>
    <div class="q-pa-sm">
      <div class="row">
        <div class="col-10">
          <q-input placeholder="Search Equip">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-1">
          <div class="flex justify-end">
            <a href="/cart">
              <q-icon
                name="shopping_cart"
                size="28px"
                color="secondary"
                class="q-pt-md"
              />
            </a>
          </div>
        </div>
        <div class="col-1">
          <div class="flex justify-center">
            <a href="/history">
              <q-icon
                name="history"
                size="28px"
                color="secondary"
                class="q-pt-md"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        class="q-mt-md q-pa-sm"
        style="background-color: rgba(61, 221, 205, 0.2); border-radius: 10px"
      >
        <div class="text-h6 text-weight-regular text-start">Dashboard</div>
        <div v-if="loading">loading...</div>
        <div v-else class="flex justify-center q-pt-sm">
          <q-card
            v-for="item in equipment"
            :key="item.id"
            class="my-card q-mb-sm"
            @click="navigateToUpdatePage(item.id)"
          >
            <q-img
              :src="getImageUrl(item.img_url)"
              :ratio="16 / 9"
              spinner-color="primary"
              spinner-size="82px"
            />
            <q-card-section>
              <div class="text-h5 text-primary">{{ item.equip_name }}</div>
              <div class="text-subtitle1">{{ item.description }}</div>
            </q-card-section>
            <q-card-section>
              <div class="row flex items-center">
                <div class="col-3 text-h6 text-warning">
                  {{ item.amount }}
                </div>
                <div class="col-9 text-right">
                  {{ `จองแล้ว ${item.amount} ชิ้น` }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      equiment: [],
      loading: true,
    };
  },

  methods: {
    getImageUrl(img_url) {
      return `http://localhost:3000/api/file/${img_url}`;
    },
    navigateToUpdatePage(itemId) {
      this.$router.push({ name: 'addcart', params: { id: itemId } });
    },
  },

  async mounted() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://localhost:3000/api/equipment/stock", {
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

<style scoped>
.my-card {
  width: 185px;
  max-width: 250px;
  display: inline-block;
  margin-right: 10px;
}
</style>
