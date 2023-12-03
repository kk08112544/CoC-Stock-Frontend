<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md"
      style="
        max-width: 400px;
        background-color: rgba(61, 221, 205, 0.2);
        border-radius: 10px;
      "
    >
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <q-input
              Outlined
              v-model="name"
              label="Your name *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type your name',
              ]"
            />
          </div>
          <div class="col q-pl-sm">
            <q-input
              Outlined
              v-model="lname"
              label="Your surname *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type your surname',
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-input
              Outlined
              v-model="uname"
              label="Username *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type user name',
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-input
              Outlined
              type="password"
              v-model="password"
              label="Password (atleast 6 charcters)"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type your password',
                (val) =>
                  val.length >= 6 ||
                  'Password must be at least 6 characters long',
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-input
              Outlined
              type="password"
              v-model="cpassword"
              label="Comfirm Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please comfirm your password',
                (val) =>
                  val.length >= 6 ||
                  'Password must be at least 6 characters long',
              ]"
            />
          </div>
        </div>

        <div>
          <q-btn
            outline
            label="Reset"
            type="reset"
            color="primary"
            class="q-mr-sm"
          />
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SignupPage",
  data() {
    return {
      name: null,
      lname: null,
      uname: null,
      password: null,
      cpassword: null,
    };
  },
  methods: {
    async onSubmit() {
         const response = await this.$axios.get(`http://localhost:3000/api/auth/${this.uname}`);
        let db_username
        if (response.data.record !== undefined){
          db_username = response.data.record.username;
        }
        else{
          db_username = null
        }

        console.log(response.data);

        if (this.uname === db_username) {
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "warning",
            message: "This username already exists. Please choose a different username.",
          });
          return;
        }

      if (this.password !== this.cpassword) {
        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: "Passwords do not match",
        });
        return;
      }

      try {
        const response = await this.$axios.post(
          "http://localhost:3000/api/auth/signup",
          {
            names: this.name,
            lastname: this.lname,
            username: this.uname,
            password: this.password,
            confirm_password: this.cpassword,
          }
        );
        const accessToken = response.data.accessToken;
        const roleId = response.data.role_id;

        localStorage.setItem("accessToken", accessToken);

        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Registered successfully",
        });

        this.$router.push("/home");

      } catch (error) {
        console.log("Registration error", error);

        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: "Registration failed",
        });
      }
    },

    onReset() {
      this.name = null;
      this.lname = null;
      this.uname = null;
      this.password = null;
      this.cpassword = null;
    },
  },
});
</script>