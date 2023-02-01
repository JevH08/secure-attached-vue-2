<template>
  <main>
    <div class="container">
      <form>
        <h2>Register</h2>
        <label for="email">E-Mail :</label><br />
        <input type="text" v-model="form.email" /><br />
        <label for="username">Username :</label><br />
        <input type="text" v-model="form.username" /><br />
        <label for="password">Password :</label><br />
        <input type="text" v-model="form.password" /><br />
        <label for="rePassword">Confirm Password :</label><br />
        <input type="text" v-model="form.rePassword" /><br />
        <input type="button" value="Register" v-on:click="userRegister()" /><br />
        <router-link to="/">Already Have Account? Login Here</router-link>
      </form>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
}

export default {
  name: "Register",
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
        rePassword: ''
      }
    }
  },
  methods: {
    userRegister: function () {
      axios.post("http://localhost:3000/user/register", this.form)
        .then((res) => {
          alert(res.data.msg);
          // if (res.data.msg === "Validation Failed") {
          //   let errors = res.data.errors;
          //   let errorMsg = "";
          //   if (errors.email.length != 0) {
          //     for (let i = 0; i < errors.email.length; i++) {
          //       errorMsg += `${errors.email[i]}\n`;
          //     }
          //   }
          //   if (errors.username.length != 0) {
          //     for (let i = 0; i < errors.username.length; i++) {
          //       errorMsg += `${errors.username[i]}\n`;
          //     }
          //   }
          //   if (errors.password.length != 0) {
          //     for (let i = 0; i < errors.password.length; i++) {
          //       errorMsg += `${errors.password[i]}\n`;
          //     }
          //   }
          //   if (errors.rePassword.length != 0) {
          //     for (let i = 0; i < errors.rePassword.length; i++) {
          //       errorMsg += `${errors.rePassword[i]}\n`;
          //     }
          //   }
          //   alert(errorMsg);
          // }
          // else {
          //   alert("Successfully Registered");
          // }
        }).catch((error) => {
          console.log(error);
        })
    }
  }
};
</script>