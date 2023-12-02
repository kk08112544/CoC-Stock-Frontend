<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-pb-md text-h5">Stock</div>
      <q-table
        flat
        bordered
        grid
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
      >
        <template v-slot:top>
          <q-btn
            color="primary"
            :disable="loading"
            label="Add row"
            to="/add"
          />
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-img
              :src="props.row.imgUrl"
              alt="Equipment Image"
              style="max-width: 100%; max-height: 100px;"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              color="negative"
              dense
              flat
              icon="edit"
              @click="updateEquipment(props.row.id)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-delete="props">
          <q-td :props="props">
            <q-btn
              color="negative"
              dense
              flat
              icon="delete"
              @click="deleteEquipment(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Update Equipment Form -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section>
          <!-- Input fields for updating equipment data -->
          <q-input
            v-model="input.equip_name"
            label="Title"
            outlined
          />
          <q-input
            v-model="input.amount"
            label="Amount"
            outlined
          />
          <q-input
            v-model="input.description"
            label="Description"
            outlined
          />
          <div>
            <q-img
              v-if="input.img_url"
              :src="input.img_url"
              :ratio="4 / 3"
              spinner-color="primary"
              spinner-size="82px"
            ></q-img>
            <!-- file size = 1MB -->
            <q-file
              outlined
              label="Your avatar"
              v-model="uploadFile"
              accept=".jpg, .jpeg, .png"
              max-file-size="1048576"
              @rejected="onRejected"
              @update:model-value="updateFile()"
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" @click="form_edit = false" />
          <q-btn label="Update" color="negative" @click="handleUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section class="text-h6">
          <q-icon :name="dialog.icon" :color="dialog.iconColor" />
          {{ dialog.msg }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn :color="dialog.btnType" label="OK" @click="showDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from "vue";

export default defineComponent({
  name: "StaffEqPage",
  setup() {
    const loading = ref(false);
    const filter = ref("");
    const rows = ref([]);
    const input = ref({});
    const form_edit = ref(false);
    const showDialog = ref(false);
    const dialog = ref({
      icon: "",
      msg: "",
      btnType: "",
      iconColor: "primary",
    });
    const uploadFile = ref(null);

    const fetchData = async () => {
      loading.value = true;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch("http://localhost:3000/api/equipment", {
          headers: {
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          await Promise.all(
            data.map(async (item) => {
              const imgResponse = await fetch(`http://localhost:3000/api/file/${item.img_url}`);

              if (imgResponse.ok) {
                const imgBlob = await imgResponse.blob();
                const imgUrl = URL.createObjectURL(imgBlob);
                item.imgUrl = imgUrl;
              } else {
                console.warn(`Failed to fetch image for ${item.img_url}`);
              }
            })
          );

          rows.value = data;
        } else {
          const textData = await response.text();
          console.warn(`Received non-JSON response: ${textData}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };

    const deleteEquipment = async (id) => {
      const token = localStorage.getItem("accessToken");
      const apiUrl = `http://localhost:3000/api/equipment/deleteEquip/${id}`;

      try {
        const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        rows.value = rows.value.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    };

    const updateEquipment = async (id) => {
      const token = localStorage.getItem("accessToken");

      try {
        const imageFormData = new FormData();
        imageFormData.append("file", uploadFile.value);

        const imageResponse = await fetch(`http://localhost:3000/api/file/${input.value.img_url}`, {
          method: "PUT",
          headers: {
            "x-access-token": token,
          },
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error(`Image update failed with status ${imageResponse.status}`);
        }

        const dataResponse = await fetch(`http://localhost:3000/api/equipment/updateEquip/${input.value.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(input.value),
        });

        if (!dataResponse.ok) {
          throw new Error(`Data update failed with status ${dataResponse.status}`);
        }

        const updatedRow = { ...input.value, imgUrl: uploadFile.value };
        const index = rows.value.findIndex((item) => item.id === input.value.id);
        rows.value.splice(index, 1, updatedRow);

        showDialog.value = true;
        dialog.value = {
          icon: "check",
          msg: "Equipment updated successfully",
          btnType: "positive",
          iconColor: "positive",
        };
      } catch (error) {
        showDialog.value = true;
        dialog.value = {
          icon: "warning",
          msg: `Error updating equipment: ${error.message}`,
          btnType: "negative",
          iconColor: "negative",
        };
      } finally {
        form_edit.value = false;
      }
    };

    onBeforeMount(fetchData);

    return {
      loading,
      filter,
      rows,
      deleteEquipment,
      columns: [
        { name: "img_url", label: "Image", field: "img_url" },
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: "id",
          sortable: true,
        },
        {
          name: "equip_name",
          align: "center",
          label: "Equipment",
          field: "equip_name",
          sortable: true,
        },
        { name: "amount", label: "Amount", field: "amount" },
        { name: "description", label: "Description", field: "description" },
      ],
      input,
      form_edit,
      showDialog,
      dialog,
      uploadFile,
    };
  },
});
</script>
