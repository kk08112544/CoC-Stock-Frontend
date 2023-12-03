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
          <q-file filled bottom-slots v-model="model" label="Upload Image" counter>
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="model = null"
                class="cursor-pointer"
              />
            </template>
          </q-file>
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
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateToolPage',
  data() {
    return {
      model: null,
      name: '',
      amount: '',
      description: '',
    };
  },
  methods: {
    async onSubmit() {
      try {
        const fileFormData = new FormData();
        fileFormData.append('singlefile', this.model);

        const fileUploadResponse = await axios.post('http://localhost:3000/api/file/upload', fileFormData);
        const img_url = fileUploadResponse.data.uploadFileName;

        const equipData = {
          equip_name: this.name,
          img_url,
          amount: this.amount,
          description: this.description,
        };

        const token = localStorage.getItem("accessToken");
        const equipCreateResponse = await axios.post('http://localhost:3000/api/equipment/addEquip', equipData, {
          headers: {
            "x-access-token": token,
            'Content-Type': 'application/json',
          },
        });
        console.log('Equipment created successfully:', equipCreateResponse.data);

        this.$router.push('/EqStaff');

      } catch (error) {
        console.error('Error creating equipment:', error);
      }
    },
  },
};
</script>
