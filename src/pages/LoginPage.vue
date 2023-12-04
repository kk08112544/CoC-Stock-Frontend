<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 350px; background-color: rgba(61, 221, 205, 0.2); border-radius: 10px;">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input outlined v-model="username" label="Enter user name" lazy-rules :rules="usernameRules" />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-input
              outlined
              type="password"
              v-model="password"
              label="Enter password"
            />
            <!-- lazy-rules
              :rules="passwordRules" -->
          </div>
        </div>

        <div class="text-center">
          <q-btn label="Submit" type="submit" color="primary" class="btn-fixed-width" />
        </div>

        <div class="row q-pt-sm text-center">
          <div class="col text-primary">
            <p>Not Registered?</p>
          </div>
          <div class="col text-blue">
            <p style="text-decoration: underline">
              <router-link to="/signup">Create an Account</router-link>
            </p>
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      username: null,
      password: null,
    };
  },
  computed: {
    usernameRules() {
      return [(val) => (val && val.length > 0) || "Please type user name"];
    },
    passwordRules() {
      return [
        (val) => (val && val.length > 0) || "Please type password",
        (val) => val.length >= 6 || "Password must be at least 6 characters long",
      ];
    },
  },
  methods: {
    async onSubmit() {
      try {
        // Use process.env.BASE_URL for dynamic API URL based on environment
        const response = await this.$axios.post(`http://localhost:3000/api/auth/login`, {
          username: this.username,
          password: this.password,
        });

        const accessToken = response.data.accessToken;
        const roleId = response.data.role_id;
        const userId = response.data.id;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", userId);

        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Logged in successfully",
        });

        console.log(response.data);

        // Check if roleId is a number (remove quotes around 1)
        this.$router.push(parseInt(roleId, 10) === 1 ? "/EqStaff" : "/user/home");

      }catch (error) {
        console.log("Login error", error);
        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: "Login failed",
        });
      }
    },
  },
});
</script>
