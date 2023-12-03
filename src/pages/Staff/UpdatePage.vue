<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md"
      style="
        width: 400px;
        background-color: rgba(61, 221, 205, 0.2);
        border-radius: 10px;
      "
    >
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <q-img
            :src="getImageUrl()"
            :ratio="16 / 9"
            spinner-color="primary"
            spinner-size="82px"
          />
          <q-file
            filled
            bottom-slots
            v-model="model"
            label="Upload Image"
            counter
            @input="updateImage"
          />
        </div>
        <div>
          <q-input Outlined v-model="name" label="Equip Name" />
        </div>
        <div>
          <q-input Outlined v-model="amount" label="Amount" />
        </div>
        <div>
          <q-input Outlined v-model="description" label="Description" />
        </div>

        <div>
          <q-btn label="Update" type="submit" color="positive" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "UpdatePage",
  data() {
    return {
      model: null,
      name: this.$route.query.equip_name,
      amount: this.$route.query.amount,
      description: this.$route.query.description,
    };
  },
  methods: {
    getImageUrl() {
      return this.model
        ? URL.createObjectURL(this.model)
        : `http://localhost:3000/api/file/${this.$route.query.img_url}`;
    },
    async updateImage() {
      try {
        const fileFormData = new FormData();
        fileFormData.append("singlefile", this.model);

        const fileUploadResponse = await axios.post(
          "http://localhost:3000/api/file/upload",
          fileFormData
        );
        const img_url = fileUploadResponse.data.uploadFileName;

        // Update the image URL and any other related data
        this.$set(this.$data, "model", new File([this.model], img_url));
      } catch (error) {
        console.error("Error updating image:", error);
      }
    },
    async onSubmit() {
      const equipId = this.$route.params.id;

      try {
        const fileFormData = new FormData();
        fileFormData.append("singlefile", this.model);
        let img_url;
        if (this.model != null) {
          const fileUploadResponse = await axios.post(
            "http://localhost:3000/api/file/upload",
            fileFormData
          );
          img_url = fileUploadResponse.data.uploadFileName;
        } else {
          img_url = null;
        }
        let equipData;
        if (img_url !== null) {
          equipData = {
            equip_name: this.name,
            img_url,
            amount: this.amount,
            description: this.description,
          };
        } else {
          equipData = {
            equip_name: this.name,
            amount: this.amount,
            description: this.description,
          };
        }

        const token = localStorage.getItem("accessToken");
        const equipUpdateResponse = await axios.put(
          `http://localhost:3000/api/equipment/updateEquip/${equipId}`,
          equipData,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "Equipment updated successfully:",
          equipUpdateResponse.data
        );

        this.$router.push("/EqStaff");
      } catch (error) {
        console.error("Error updating equipment:", error);
      }
    },
  },
};
</script>
