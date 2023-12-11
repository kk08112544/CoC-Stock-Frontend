<template>
  <q-page padding>
    <div class="text-h4 q-pb-md text-center">
      List of Your User id: {{ userId }}
    </div>
    <div v-if="loading">Loading...</div>
    <!-- ... other HTML ... -->
    <div v-else>
      <q-table
        flat
        bordered
        :rows="historyItems"
        :columns="columns"
        row-key="id"
      >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="user_id" :props="props">{{ props.row.user_id }}</q-td>
            <q-td key="equip_id" :props="props">{{ props.row.equip_id }}</q-td>
            <q-td key="equip_name" :props="props">{{
              props.row.equip_name
            }}</q-td>
            <q-td key="amount" :props="props">
              <div class="row flex flex-center">
                  <div class="col">
                    <q-btn @click="decrementAmount(props.row)" label="-" dense flat />
                  </div>
                  <div class="col">
                    <q-input v-model="props.row.amount" :style="{ width: '25px' }" />
                  </div>
                  <div class="col">
                      <q-btn @click="incrementAmount(props.row)" label="+" dense flat />
                  </div>
              </div>
            </q-td>
          <!-- ... other columns ... -->
          <q-td key="action">
            <q-btn
              color="primary"
              flat
              round
              icon="edit"
              @click="editRecord(props.row)"
            />
            <q-btn
              color="primary"
              flat
              round
              icon="delete"
              @click="deleteRecord(props.row)"
            />
            <q-btn
                color="primary"
                flat
                round
                icon="add"
                @click="addRecord(props.row)"
              />
          </q-td>
        </q-tr>
        <!-- Edit Dialog -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="primary" text-color="white" />
          <span class="q-ml-sm">Update Equipment ID: {{ input.id }}</span>
        </q-card-section>
        <q-card-section>
          <span class="q-ml-sm">Equipment Name: {{ input.equip_name }}</span>
        </q-card-section>
        <q-card-section>
          <span class="q-ml-sm">Amount: {{ input.inputValue }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="NO" color="primary" v-close-popup />
          <q-btn flat label="YES" color="primary" @click="onEdit(input)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

      </template>
    </q-table>
    <q-dialog v-model="form_add" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="add" color="primary" text-color="white" />
            <span class="q-ml-sm">Add this Cart ID: {{ input.cart_id }}</span>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Add this Equipment ID: {{ input.e_id }}</span>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Add this User ID: {{ input.user_id }}</span>
          </q-card-section>
          <q-card-section>
            <span class="q-ml-sm">Equipment Name: {{ input.equip_name }}</span>
          </q-card-section>
          <q-card-section>
            <span class="q-ml-sm">Amount: {{ input.inputValue }}</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="NO" color="primary" v-close-popup />
            <q-btn flat label="YES" color="primary" @click="onAdd" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    <q-dialog v-model="form_delete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Delete Equipment ID: {{ input.id }}</span>
          </q-card-section>
          <q-card-section>
            <span class="q-ml-sm">Equipment Name: {{ input.equip_name }}</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="NO" color="primary" v-close-popup />
            <q-btn flat label="YES" color="primary" @click="onDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- ... other dialogs ... -->
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "CartPage",

  data() {
    return {
      userId: null,
      historyItems: [],
      loading: true,
      columns: [
        { name: "id", label: "ID", align: "left", field: "id", sortable: true },
        { name: "user_id", label: "User ID", align: "left", field: "user_id", sortable: true },
        { name: "equip_id", label: "Equipment ID", align: "left", field: "equipment_id", sortable: true },
        { name: "equip_name", label: "Equipment Name", align: "left", field: "equip_name" },
        { name: "amount", label: "Amount", align: "center", field: "amount" },
        { name: "action", label: "Actions", field: "action", align: "left" },
      ],
      form_delete: false,
      form_edit: false,
      form_add: false,
      input: {
        id: null,
        equip_name: null,
        equip_id: null,
        user_id: null,
      },
    };
  },

  setup() {
    const equipment = ref([]);

    const fetchEquipment = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("http://localhost:3000/api/equipment/stock", {
          headers: {
            "x-access-token": token,
          },
        });

        equipment.value = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        loading = false;
      }
    };

    fetchEquipment();

    return {
      equipment,
    };
  },

  methods: {
    async fetchCart() {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`, {
          headers: {
            "x-access-token": token,
          },
        });

        this.historyItems = response.data.Cart.map((item, index) => ({
          id: index + 1,
          ...item,
          inputValue: item.amount,
        }));

        this.loading = false;
      } catch (error) {
        console.error("Error fetching history data:", error);
        this.loading = false;
      }
    },

    incrementAmount(row) {
      row.amount++;
    },

    decrementAmount(row) {
      if (row.amount > 0) {
        row.amount--;
      }
      console.log(row)
    },

    editRecord(row) {
      this.input.id = row.id;
      this.input.equip_name = row.equip_name;
      this.input.e_id = row.equip_id;
      this.input.amount = row.amount;
      this.input.inputValue = row.amount;
      this.form_edit = true;
    },

    addRecord(row) {
      this.input.cart_id = row.id;
      this.input.equip_name = row.equip_name;
      this.input.e_id = row.equip_id;
      this.input.user_id = row.user_id;
      this.input.inputValue = row.amount;
      this.form_add = true;
    },
    async onAdd() {
  try {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    // Step 1: Make API call to add the item to the history
    const historyRequestBody = {
      cart_id: this.input.cart_id,
      user_id: userId,
      equip_id: this.input.e_id,
      amount: this.input.inputValue,
    };

    const historyResponse = await axios.post(
      "http://localhost:3000/api/history/addHistory",
      historyRequestBody,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    // Check if the history item was added successfully
    if (historyResponse.status !== 200) {
      console.error("Failed to add item to history:", historyResponse.statusText);
      return;
    }

    // Optionally, you can update the local state or trigger a refresh of the history table
    // For example, you might emit an event or update a Vuex store

    // Optionally, you can reload the page or update the state as needed
    window.location.reload();
  } catch (error) {
    console.error("An error occurred during the API call:", error);
    // Handle errors or display a notification to the user
  } finally {
    // Close the dialog, whether the operation was successful or not
    this.form_add = false;
  }
},

    // async onAdd() {
    //   // ... (unchanged)
    //   try {
    //   const token = localStorage.getItem("accessToken");
    //   const userId = localStorage.getItem("userId");

    //   const requestBody = {
    //     cart_id: this.input.cart_id,
    //     user_id: userId,
    //     equip_id: this.input.e_id,
    //     amount: this.input.inputValue,
    //   };

    //   const response = await axios.post(
    //     "http://localhost:3000/api/history/addHistory",
    //     requestBody,
    //     {
    //       headers: {
    //         "x-access-token": token,
    //       },
    //     }
    //   );

    //   if (response.status === 200) {
    //     this.$q.notify({
    //       color: "positive",
    //       textColor: "white",
    //       icon: "check_circle",
    //       message: "Added successfully.",
    //     });

    //     // Optionally, you can update the local state or trigger a refresh of the cart table
    //     // For example, you might emit an event or update a Vuex store

    //     window.location.reload(); // Reload the page or update the state as needed
    //   } else {
    //     console.error("Failed to add item:", response.statusText);
    //   }
    // } catch (error) {
    //   console.error("An error occurred during the API call:", error);
    // }
    // },

    async onEdit(input) {
      // ... (unchanged)
      try {
      const token = localStorage.getItem("accessToken");
      const response = await this.$axios.put(
        `http://localhost:3000/api/cart/updateCart/${input.id}`,
        { amount: input.inputValue },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.Message) {
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "warning",
            message: response.data.Message,
          });
        }

        // Optionally, you can update the local state or trigger a refresh of the cart table
        // For example, you might emit an event or update a Vuex store

        window.location.reload(); // Reload the page or update the state as needed
      } else {
        console.error("Failed to update item:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the update:", error);
    } finally {
      this.form_edit = false; // Close the dialog, whether the update was successful or not
    }
    },

    deleteRecord(row) {
      this.input.id = row.id;
      this.input.equip_name = row.equip_name;
      this.form_delete = true;
    },

    async onDelete() {
      // ... (unchanged)
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `http://localhost:3000/api/cart/deleteCart/${this.input.id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        console.log(AuthenticatorResponse);
        if (response.status === 200) {
          this.historyItems = this.historyItems.filter(
            (item) => item.id !== this.input.id
          );
          this.form_delete = false;
          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "check_circle",
            message: "Delete this Id Successfully.",
          });
        } else {
          console.error("Error deleting record:", response);
          alert("Error deleting record. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Error deleting record. Please try again.");
      }
    },
  },

  mounted() {
    this.userId = localStorage.getItem("userId");
    this.fetchCart();
  },
});
</script>
