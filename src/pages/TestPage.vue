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
            <q-td key="equip_name" :props="props">{{ props.row.equip_name }}</q-td>
            <q-td key="amount" :props="props">{{props.row.inputValue}}</q-td>
            <!-- <q-td key="amount" :props="props">
              <div class="row flex flex-center">
                <div class="col">
                  <q-btn @click="decrementAmount(props.row)" label="-" dense flat />
                </div>
                <div class="col">
                  <q-input v-model="props.row.inputValue" :style="{ width: '25px' }" />
                </div>
                <div class="col">
                  <q-btn @click="incrementAmount(props.row)" label="+" dense flat />
                </div>
              </div>
            </q-td> -->
            <q-td key="action">
              <q-btn color="primary" flat round icon="history"  type="submit" @click="addRecord(props.row)" />
              <q-btn color="primary" flat round icon="edit" @click="editRecord(props.row)" />
              <q-btn color="primary" flat round icon="delete" @click="deleteRecord(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!-- Delete Dialog -->
      <q-dialog v-model="form_edit" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Update Equipment ID: {{ input.id }}</span>
          </q-card-section>
          <q-card-section>
            <span class="q-ml-sm">Equipment Name: {{ input.equip_name }}</span>
          </q-card-section>
          <q-card-section>
            <div class="row flex flex-center">
                <div class="col">
                  <q-btn @click="decrementAmount(props.row)" label="-" dense flat />
                </div>
                <div class="col">
                  <q-input v-model="props.row.inputValue" :style="{ width: '25px' }" />
                </div>
                <div class="col">
                  <q-btn @click="incrementAmount(props.row)" label="+" dense flat />
                </div>
              </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="NO" color="primary" v-close-popup />
            <q-btn flat label="YES" color="primary" @click="onEdit" />
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
      <q-dialog v-model="form_add" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="add" color="primary" text-color="white" />
        <span class="q-ml-sm">Add Equipment ID: {{ input.id }}</span>
      </q-card-section>
      <q-card-section>
        <span class="q-ml-sm">Equipment Name: {{ input.equip_name }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="NO" color="primary" v-close-popup />
        <q-btn flat label="YES" color="primary" @click="onAdd" />
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
  name: "TestPage",

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
      form_edit:false,
      input: {
        id: null,
        equip_name: null,
      },
    };
  },

  setup() {
    return {
      val: ref(true),
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
      row.inputValue++;
    },

    decrementAmount(row) {
      if (row.inputValue > 0) {
        row.inputValue--;
      }
    },

    editRecord(row) {
  // Implement edit functionality if needed
      this.input.id = row.id;
      this.input.equip_name = row.equip_name;
      this.input.amount = row.amount;
      this.form_edit.value = true; // Access the value property
      console.log(this.form_edit.value); // Check the value in the console
    },
    async onAdd() {
      try {
        const token = localStorage.getItem("accessToken");

        // Make the API call to add a history record
        const response = await axios.post(
          "http://localhost:3000/api/history/addHistory",
          {
            cart_id: this.id,
            user_id: this.userId,
            equip_id: this.input.equip_id, // Assuming this is available in your data
            amount: this.input.amount, // Assuming this is available in your data
            // Add other necessary data for your API call
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        // Check the response and update your data or perform other actions
        if (response.status === 200) {
          // Add logic to handle a successful response
          console.log("History record added successfully!");
        } else {
          // Handle errors or provide user feedback
          console.error("Error adding history record:", response);
          alert("Error adding history record. Please try again.");
        }

        // Close the form_add dialog after the API call
        this.form_add = false;
      } catch (error) {
        console.error("Error adding history record:", error);
        alert("Error adding history record. Please try again.");
      }
    },
    async onEdit() {
      try {
          const token = localStorage.getItem("accessToken");
          const newAmount = this.input.amount; // Add this line to get the updated amount
          const response = await axios.put(
            `http://localhost:3000/api/cart/updateCart/${this.input.id}`,
                { amount: newAmount },
                  {
                    headers: {
                      "x-access-token": token,
                  },
            }
          );

    // Rest of your code...
  } catch (error) {
    console.error("Error updating record:", error);
    alert("Error updating record. Please try again.");
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
    const response = await axios.delete(`http://localhost:3000/api/cart/deleteCart/${this.input.id}`, {
          headers: {
            "x-access-token": token,
          },
    });

    console.log(AuthenticatorResponse);
    if (response.status === 200) {
      this.historyItems = this.historyItems.filter(item => item.id !== this.input.id);
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
}

  },

  mounted() {
    this.userId = localStorage.getItem("userId");
    this.fetchCart();
  },
});
</script>
