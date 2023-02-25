<template>
  <main>
    <div class="container">
      <form v-on:submit.prevent="download()" enctype="multipart/form-data">
        <h2>Decrypt dan Download</h2>
        <label for="download_code">Kode Download : </label>
        <input type="text" v-model="form.down_code" /><br />
        <label for="password_file">Password File : </label>
        <input type="text" v-model="form.pass_txt" /><br />
        <label for="file">Private Key (jika .txt) : </label>
        <input type="file" ref="privateKey" v-on:change="handleKeyUpload()" /><br />
        <input type="button" value="Download" v-on:click="download()" /><br />
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
import FileSaver  from 'file-saver';
import * as openpgp from 'openpgp';
import Vue from 'vue';
import { Buffer } from 'buffer'; //buffer untuk encode decode base64
globalThis.Buffer = Buffer;

// const headers = {
//   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
// }
// const headers = { 'Content-Type': 'multipart/form-data' };

export default {
  name: "Download",
  data() {
    return {
      form: {
        down_code: '',
        pass_txt: '',
        key: null
      }
    }
  },
  methods: {
    handleKeyUpload(){
      this.form.key = this.$refs.privateKey.files[0];
    },
    download: function () {
      const cookieIDpenerima = Vue.$cookies.get("id_user");
      const privKeyFile = this.form.key;
      const passphrase = this.form.pass_txt;

      axios({
        method: 'get',
        url: 'http://localhost:3000/download/' + this.form.down_code
      })
      .then(function (response) {
        if(response.data.message == 'txt'){
          var file_message = Buffer.from(response.data.download_file, 'base64').toString()
          
          dekrip();
          async function dekrip() {
            var privKey = await privKeyFile.text();
            
            const privateKey = await openpgp.decryptKey({
              privateKey: await openpgp.readPrivateKey({ armoredKey: privKey}),
              passphrase
            });

            const message = await openpgp.readMessage({
              armoredMessage: file_message // parse armored message
            });
            
            const { data: decrypted } = await openpgp.decrypt({
              message,
              decryptionKeys: privateKey
            });

            console.log(decrypted); // 'Hello, World!'
            
            var blob = new Blob([decrypted], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, 'decrypted.txt');
          }
        }else if(response.data.message == 'zip'){
          var myBuffer = Buffer.from(response.data.download_file, 'base64');

          dekrip();
          async function dekrip() {
            const encryptedMessage = await openpgp.readMessage({
                binaryMessage: myBuffer // parse encrypted bytes
            });
            const { data: decrypted } = await openpgp.decrypt({
                message: encryptedMessage,
                passwords: [passphrase], // decrypt with password
                format: 'binary' // output as Uint8Array
            });

            var blob = new Blob([decrypted]);
            FileSaver.saveAs(blob, 'decrypted.zip');
          }
        }
      });

    }
  }
};
</script>