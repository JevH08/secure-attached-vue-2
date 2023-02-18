<template>
  <main>
    <div class="container">
      <form>
        <h2>Generate Key</h2>
        <label for="email">E-Mail :</label><br />
        <input type="text" v-model="form.email" /><br />
        <label for="username">Username :</label><br />
        <input type="text" v-model="form.username" /><br />
        <label for="password">Passphrase :</label><br />
        <input type="text" v-model="form.passphrase" /><br />
        <input type="button" value="Generate Key" v-on:click="generateKey()" /><br />
      </form>
    
      <footer class="position-absolute top-0 start-50 translate-middle">
        <b-container class="bv-example-row fixed-bottom">
            <b-row class="foot justify-content-evenly ">
                <!-- <b-col class="item"><router-link class="dark-blue" to="/">Home</router-link></b-col> -->
                <b-col class="item"><router-link class="dark-blue" to="/generate">Generate Key</router-link></b-col>
                <b-col class="item"><router-link class="dark-blue" to="/upload/new">Upload</router-link></b-col>
                <b-col class="item"><router-link class="dark-blue" to="/download">Download</router-link></b-col>
                <b-col class="item"><router-link class="dark-blue" to="/upload/history">History</router-link></b-col>
            </b-row>
        </b-container>
      </footer>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { Buffer } from 'buffer'; //buffer untuk encode decode base64
import FileSaver  from 'file-saver';
import Vue from 'vue';
globalThis.Buffer = Buffer

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
}

export default {
  name: "Generate",
  data() {
    const cookieIDpengirim = Vue.$cookies.get("id_user");
    return {
      form: {
        email: '',
        username: '',
        passphrase: '',
        fk_pengguna: cookieIDpengirim
      }
    }
  },
  methods: {
    generateKey: function () {
      axios.post("http://localhost:3000/key/generate", this.form)
        .then((res) => {
          console.log(res);
          if (res.data.message === "Validation Failed") {
            let errors = res.data.errors;
            let errorMsg = "";
            if (errors.email.length != 0) {
              for (let i = 0; i < errors.email.length; i++) {
                errorMsg += `${errors.email[i]}\n`;
              }
            }
            if (errors.username.length != 0) {
              for (let i = 0; i < errors.username.length; i++) {
                errorMsg += `${errors.username[i]}\n`;
              }
            }
            alert(errorMsg);
          }else if (res.data.message === "Logged in User and email mismatch") {
            alert("User yang login berbeda dengan email yang didaftarkan");
          }
          else {
            let keys = res.data.key;
            let privateKeyEncoded = keys.private;
            let publicKeyEncoded = keys.public;

            let privateKeyDecoded = Buffer.from(privateKeyEncoded, 'base64').toString('ascii');
            var blob = new Blob([privateKeyDecoded], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "privatekey");

            let publicKeyDecoded = Buffer.from(publicKeyEncoded, 'base64').toString('ascii');
            var blob = new Blob([publicKeyDecoded], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "publickey");
            //gg ini berhasil
          }
        }).catch((error) => {
          console.log(error);
        })
    }
  }
};
</script>