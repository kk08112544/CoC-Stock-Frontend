<template>
  <q-page padding>
    <div class="text-h4 q-pb-md text-center">
      List of Your User id: {{ userId }}
    </div>
    <div v-if="loading">Loading...</div>
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
            <q-td key="amount" :props="props">{{ props.row.inputValue }}</q-td>
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
            </q-td> </q-tr
          ><q-dialog v-model="form_edit" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="delete" color="primary" text-color="white" />
                <span class="q-ml-sm">Update Equipment ID: {{ input.id }}</span>
              </q-card-section>
              <q-card-section>
                <span class="q-ml-sm"
                  >Equipment Name: {{ input.equip_name }}</span
                >
              </q-card-section>
              <q-card-section>
                <div class="row flex flex-center">
                  <div class="col">
                    <q-btn
                      @click="decrementAmount(input)"
                      label="-"
                      dense
                      flat
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="input.inputValue"
                      :style="{ width: '25px' }"
                    />
                  </div>
                  <div class="col">
                    <q-btn
                      @click="incrementAmount(input)"
                      label="+"
                      dense
                      flat
                    />
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="NO" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="YES"
                  color="primary"
                  @click="onEdit(input)"
                />
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

      <!-- Delete Dialog -->
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
        {
          name: "user_id",
          label: "User ID",
          align: "left",
          field: "user_id",
          sortable: true,
        },
        {
          name: "equip_id",
          label: "Equipment ID",
          align: "left",
          field: "equipment_id",
          sortable: true,
        },
        {
          name: "equip_name",
          label: "Equipment Name",
          align: "left",
          field: "equip_name",
        },
        { name: "amount", label: "Amount", align: "center", field: "amount" },
        { name: "action", label: "Actions", field: "action", align: "left" },
      ],
      form_delete: false,
      form_edit: false,
      form_add: false,
      // dialogVisible: false,
      input: {
        id: null,
        equip_name: null,
        equip_id: null,  // Make sure these properties are defined
        user_id: null,
      },
    };
  },

  setup() {
    const equipment = ref([]);

    // Fetch equipment data and update the ref
    const fetchEquipment = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/equipment/stock",
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        equipment.value = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        loading = false;
      }
    };

    // Call fetchEquipment on component mount
    fetchEquipment();

    // Expose variables and functions to the template
    return {
      equipment,
      // loading,
      // searchQuery,
      // getImageUrl,
      // addToCart,
      // validateAmount,
      // isAmountValid,
    };
    return {
      val: ref(true),
    };
  },

  methods: {
    async fetchCart() {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cart/${userId}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

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
      console.log(row);
      row.inputValue++;
    },

    decrementAmount(row) {
      if (row.inputValue > 0) {
        row.inputValue--;
      }
    },

    editRecord(row) {
      console.log(row.id);
      // Implement edit functionality if needed
      this.input.id = row.id;
      this.input.equip_name = row.equip_name;
      this.input.e_id = row.equip_id;
      this.input.amount = row.amount;
      this.input.inputValue = row.amount;
      this.form_edit = true; // Access the value property
      console.log(this.form_edit.value); // Check the value in the console
      // if (row && row.props) {
      //   this.input.id = row.props.row.id;
      //   this.input.equip_name = row.props.row.equip_name;
      //   this.input.amount = row.props.row.amount;
      //   this.form_edit = true;
      // }
    },
    addRecord(row) {
      this.input.cart_id = row.id;
      this.input.equip_name = row.equip_name;
      this.input.e_id = row.equip_id;  // Make sure these assignments are correct
      this.input.user_id = row.user_id;
      this.input.inputValue = row.amount;
  // Open the add dialog
      this.form_add = true;
      // Reset input properties if needed
      // this.input.id = row.id;
      // this.input.equip_name = row.equip_name;

      // this.input.inputValue = row.amount;
      // // Open the add dialog
      // this.form_add = true;
    },
    // showDialog(row){
    //  // this.input.id = row.id;
    //   this.input.equip_name = row.equip_name;
    //   this.input.e_id = row.equip_id;
    //   this.input.cart_id = row.id;
    //   this.input.user_id = row.userId ;
    //   this.input.inputValue = row.amount;
    //   this.form_edit = true; // Access the value property
    //   console.log(this.form_edit.value);
    // },
    async onAdd() {
      try {
        const token = localStorage.getItem("accessToken"); // Assuming you have a token stored after authentication
        const userId = localStorage.getItem("userId");

        const requestBody = {
          cart_id: this.input.cart_id,
          user_id: this.input.user_id, // Replace with the actual user ID
         // Replace with the actual cart ID
          equip_id: this.input.e_id, // Replace with the actual equipment ID
          amount: this.input.inputValue, // Replace with the actual amount
        };

        const response = await axios.post(
          "http://localhost:3000/api/history/addHistory",
          requestBody,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "check_circle",
            message: "Add this Id Successfully.",
        });

        console.log("API Response:", response.data);
      
        window.location.reload();
        // You can perform additional actions based on the API response here
      } catch (error) {
        console.error("An error occurred during the API call:", error);
        // Handle errors or display a notification to the user
      }
    },

    async onEdit(input) {
      const e_amount = this.equipment.filter((item) => item.id === input.e_id);
      console.log(input);
      console.log(this.equipment);
      // if (input.inputValue > e_amount){
      //   this.$q.notify({
      //     color: "negative",
      //     textColor: "white",
      //     icon: "warning",
      //     message: "Over stock",
      //   });
      //   return;
      // }
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

        // Check the response and handle accordingly
        if (response.status === 200) {
          if (response.data.Message) {
            this.$q.notify({
              color: "negative",
              textColor: "white",
              icon: "warning",
              message: response.data.Message,
            });
          }
          // Update the local state or trigger a refresh of the cart table
          // For example, you might emit an event or update a Vuex store
          this.$emit("cart-updated", response.data);
          window.location.reload();
        } else {
          // Handle error
          console.error("Failed to update cart:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the update:", error);
      } finally {
        // Close the dialog, whether the update was successful or not
        this.form_edit = false;
      }
    },

    deleteRecord(row) {
      this.input.id = row.id;
      this.input.equip_name = row.equip_name;
      this.form_delete = true;
    },

    async onDelete() {
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
    // this.fetchEquipment();
  },
});
</script>
