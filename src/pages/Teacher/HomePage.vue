<template>
  <q-page padding>
    <div class="q-pa-sm">
      <div class="row">
        <div class="col-10">
          <q-input v-model="searchQuery" placeholder="Search Equip">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-1">
          <div class="flex justify-end">
            <router-link to="/user/cart">
              <q-icon
                name="shopping_cart"
                size="28px"
                color="secondary"
                class="q-pt-md"
              />
            </router-link>
          </div>
        </div>
        <div class="col-1">
          <div class="flex justify-center">
            <router-link to="/user/history">
              <q-icon
                name="history"
                size="28px"
                color="secondary"
                class="q-pt-md"
              />
            </router-link>
          </div>
        </div>
      </div>

      <div
        class="q-mt-md q-pa-sm"
        style="background-color: rgba(61, 221, 205, 0.2); border-radius: 10px"
      >
        <div class="text-h6 text-weight-regular text-start">All equipment</div>
        <div v-if="loading">loading...</div>
        <div v-else class="flex justify-center q-pt-sm">
          <q-card
            v-for="item in filteredEquipment"
            :key="item.id"
            class="my-card q-mb-sm"
          >
            <q-img
              :src="getImageUrl(item.img_url)"
              :ratio="16 / 9"
              spinner-color="primary"
              spinner-size="82px"
            />
            <q-card-section class="q-pa-sm">
              <div class="text-h5 text-primary">{{ item.equip_name }}</div>
              <div class="text-subtitle1">{{ item.description }}</div>
            </q-card-section>
            <q-card-section class="q-pa-sm">
              <div align="right">
                <div class="text-subtitle1 text-warning" >
                  {{ `${item.amount} in stock` }}
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pt-xs">
              <q-input
                v-model="item.quantityToAdd"
                type="number"
                dense
                outlined
                label="Amount"
                style="max-width: 90px; margin-right: 10px"
                :rules="[validateAmount(item.amount)]"
                class="q-mt-xs"
              />
              <q-btn
                v-if="isAmountValid(item.amount, item.quantityToAdd)"
                icon="shopping_cart"
                color="positive"
                type="submit"
                @click="addToCart(item.id, item.quantityToAdd)"
                class="q-mb-md"
              />
            </q-card-actions>
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
      equipment: [],
      loading: true,
      searchQuery: "",
    };
  },

  computed: {
    filteredEquipment() {
      const searchLowerCase = this.searchQuery.toLowerCase();
      return this.equipment.filter((item) =>
        item.equip_name.toLowerCase().includes(searchLowerCase)
      );
    },
  },

  methods: {
    getImageUrl(img_url) {
      return `http://localhost:3000/api/file/${img_url}`;
    },
    async addToCart(equipId, amount) {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.post(
          "http://localhost:3000/api/cart/addCart",
          {
            user_id: userId,
            equip_id: equipId,
            amount: amount,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        console.log("Item added to the cart:", response.data);

        this.$q.notify({
          color: "positive",
          textColor: "white",
          icon: "check_circle",
          message: "Item added to the cart successfully.",
        });
      } catch (error) {
        console.error("Error adding item to cart:", error);

        this.$q.notify({
          color: "negative",
          textColor: "white",
          icon: "warning",
          message: "Failed to add item to the cart. Please try again.",
        });
      }
    },
    validateAmount(maxAmount) {
      return (value) => {
        const isValid = value <= maxAmount;
        return isValid || `Amount is over ${maxAmount}`;
      };
    },
    isAmountValid(maxAmount, inputAmount) {
      return inputAmount > 0 && inputAmount <= maxAmount;
    },
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