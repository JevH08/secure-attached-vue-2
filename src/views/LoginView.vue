<template>
  <main>
    <div class="container">
      <form>
        <h2>Login</h2>
        <label for="email">E-Mail :</label><br />
        <input type="text" v-model="form.email" /><br />
        <label for="password">Password :</label><br />
        <input type="text" v-model="form.password" /><br />
        <input type="button" value="Login" v-on:click="userLogin()" /><br />
        <router-link to="/register">Don't have account? Register Here</router-link>
      </form>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import Vue from 'vue'
import VueCookie from 'vue-cookie'

//cookies default value
Vue.use(VueCookie, { 
  expires: '1d', 
  path: '/', 
  domain: '', 
  secure: '', 
  sameSite: 'Lax' 
})

// if($cookies.isKey("username")){
//     console.log(Vue.$cookies.get("username"))
//   }

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
}

export default {
  name: "Login",
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    userLogin: function () {
      axios.post("http://localhost:3000/user/login", this.form)
        .then((res) => {
          if (res.data.message === "Validation Failed") {
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
            alert("Logged In Successfully.");
            // if(res.data.message === "Logged In Succesfully"){
            //   let pengguna = res.data.pengguna;
            //   let email = pengguna.email_content;
            //   let username = pengguna.username_content;
            //   Vue.$cookies.set("email", email, "14d");
            //   Vue.$cookies.set("username", username, "14d");
            // }
            window.location.href = 'http://localhost:5173/register';
          }
        }).catch((error) => {
          console.log(error);
        })
    }
  }
};
</script>