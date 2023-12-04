<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> CoC Stock Application </q-toolbar-title>

        <!-- <div>test {{ $q.version }}</div> -->
        <q-btn
          flat
          dense
          round
          icon="exit_to_app"
          aria-label="Logout"
          @click="handleLogout"
          href="/login"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Home",
    caption: "All equipment",
    icon: "home",
    link: "/user/home",
    color: "primary",
  },
  // {
  //   title: "I don't what's you do",
  //   caption: "all cart may be?",
  //   icon: "shopping_cart",
  //   link: "/user/EqTeacher",
  //   color: "primary",
  // },
  {
    title: "Cart",
    caption: "Add To Cart",
    icon: "shopping_cart",
    link: "/user/cart",
    color: "primary",
  },
  {
    title: "History",
    caption: "current status",
    icon: "history",
    link: "/user/history",
    color: "primary",
  },
];

export default defineComponent({
  name: "UserLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout() {
        localStorage.removeItem("accessToken");
      },
    };
  },
});
</script>
