<template>
  <q-page padding>
    <div>this is card id: {{ cardId }}</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "AddCartPage",
  data () {
    return {
      cardId: null,
    }
  },
  mounted() {
    this.cardId = this.$route.params.id;
  }
})

</script>
