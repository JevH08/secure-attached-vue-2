<template>
  <main>
    <div class="container">
      <form action="">
        <h2>Login</h2>
        <label for="email">E-Mail :</label><br />
        <input type="text" id="email" name="email" /><br />
        <label for="password">Password :</label><br />
        <input type="text" id="password" name="password" /><br />
        <input type="button" value="Login" v-on:click="userLogin()" /><br />
        <router-link to="/register">Don't Have Account? Register Here</router-link><br />
        <router-link to="/forgot">Forgot your Password? Reset Here</router-link>
        </form>
        </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    userLogin: function () {
      axios.post("/user/login", {
        email: this.email,
        password: this.password
      }).then((res) => {
        if (res.data.msg === "Validation Failed") {
          let errors = res.data.errors;
          let errorMsg = "";
          if (errors.email.length != 0) {
            for (let i = 0; i < errors.email.length; i++) {
              errorMsg += `${errors.email[i]}\n`;
            }
          }
          if (errors.password.length != 0) {
            for (let i = 0; i < errors.password.length; i++) {
              errorMsg += `${errors.password[i]}\n`;
            }
          }
          alert(errorMsg);
        }
        else {
          console.log("Successfully Login")
          alert("Successfully Login");
          router.push("/register")
        }
      }).catch(() => {
        alert("Something Went Wrong");
      })
    }
  }
};
</script>