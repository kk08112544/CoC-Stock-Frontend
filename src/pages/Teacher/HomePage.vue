<template>
  <q-page padding>
    <div class="q-pa-sm">
      <div class="row">
        <div class="col-10">
          <q-input :dense="dense">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-1">
          <div class="flex justify-end">
            <a href="/cart">
              <q-icon name="shopping_cart" size="28px" color="secondary" class="q-pt-md" />
            </a>
          </div>
        </div>
        <div class="col-1">
          <div class="flex justify-end">
            <a href="/history">
              <q-icon name="history" size="28px" color="secondary" class="q-pt-md" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="q-mt-md q-pa-sm"
        style="background-color: rgba(61, 221, 205, 0.2); border-radius: 10px"
      >
        <div class="text-h6 text-weight-regular text-start">
          Dashboard
        </div>

        <div class="text-center">
          <div class="column" wrap style="height: fit-content">
            <div class="col-2">
              <div v-for="index in 6" :key="index" class="box">
                <q-card class="my-card">
                  <img src="https://cdn.quasar.dev/img/mountains.jpg" />
                  <q-card-section class="q-pa-sm">
                    <div class="text-h6">{{ `Title ${index}` }}</div>
                    <div class="text-subtitle2">
                      {{ `Description ${index}` }}
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-py-sm">
                    <div class="row flex items-center">
                      <div class="col-3 text-h6 text-positive">
                        {{ `${index}` }}
                      </div>
                      <div class="col-9 text-right">
                        {{ `จองแล้ว ${index} ชิ้น` }}
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "HomePage",
  setup() {
    return {
      ph: ref(""),
      dense: ref(false),
    };
  },
});
</script>

<style scoped>
.box {
  padding: 5px;
  display: inline-block;
}
.my-card {
  width: 100%;
  max-width: 170px;
}
</style>
