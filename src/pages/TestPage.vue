<!-- <template>
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
            href="/add"
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
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

const columns = [
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
    label: "Title",
    field: "equip_name",
    sortable: true,
  },
  { name: "img_url", label: "Image", field: "img_url", sortable: true },
  { name: "amount", label: "Amount", field: "amount" },
  { name: "description", label: "Description", field: "description" },
];

const originalRows = [
  {
    id: 1,
    equip_name: "tool2",
    img_url: "Fileupload-1701364074171.jpeg",
    amount: 26,
    description: "test tool",
  },
  {
    id: 2,
    equip_name: "tool2",
    img_url: "Fileupload-1700093918250.jpeg",
    amount: 20,
    description: "test tool",
  },
  {
    id: 3,
    equip_name: "tool2",
    img_url: "Fileupload-1700093918250.jpeg",
    amount: 20,
    description: "test tool",
  },
  {
    id: 4,
    equip_name: "tool2",
    img_url: "Fileupload-1700093918250.jpeg",
    amount: 20,
    description: "test tool",
  },
];

export default defineComponent({
  name: "BoardPage",
  setup() {
    const loading = ref(false);
    const filter = ref("");
    const rows = ref([...originalRows]);

    return {
      columns,
      rows,

      loading,
      filter,

    };
  },
});
</script> -->

<!-- <template>
  <q-page padding>
    <div class="q-pb-md text-h5">Stock</div>

    <div v-for="item in stockItems" :key="item.id">

      <p>{{ item.img_url }}</p>
      <h2>{{ item.equip_name }}</h2>
      <p>Amount: {{ item.amount }}</p>
      <p>Description: {{ item.description }}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "TestPage",
  data() {
    return {
      stockItems: [],
    };
  },
  mounted() {
    this.fetchStockData();
  },
  methods: {
    async fetchStockData() {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await this.$axios.get("http://localhost:3000/api/equipment/stock", {
          headers: {
            "x-access-token": token,
          },
        });

        this.stockItems = response.data;
      } catch (error) {
        console.log("Error fetching stock data", error)
      }
    }
  }
})
</script> -->
 <template>
  <q-page padding></q-page>
 </template>
