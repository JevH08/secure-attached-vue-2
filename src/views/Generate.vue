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
    <Footer />
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { Buffer } from 'buffer'; //buffer untuk encode decode base64
import FileSaver  from 'file-saver';
globalThis.Buffer = Buffer

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
}

export default {
  name: "Generate",
  data() {
    return {
      form: {
        email: '',
        username: '',
        passphrase: ''
      }
    }
  },
  methods: {
    generateKey: function () {
      axios.post("http://localhost:3000/key/generate", this.form)
        .then((res) => {
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