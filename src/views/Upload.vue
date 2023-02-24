<template>
  <main>
    <div class="container">
      <form v-on:submit.prevent="upload()" enctype="multipart/form-data">
        <h2>Encrypt dan Upload</h2>
        <label for="email">E-Mail Tujuan : </label>
        <input type="text" v-model="form.email" /><br />
        <label for="file">File : </label>
        <input type="file" ref="file" v-on:change="handleFileUpload()" /><br />
        <label for="email">File Password (untuk .zip): </label>
        <input type="text" v-model="form.passwordFile" /><br />
        <input type="button" value="Upload" v-on:click="upload()" /><br />
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
import Vue from 'vue';
import * as openpgp from 'openpgp';
import { Buffer } from 'buffer'; //buffer untuk encode decode base64
globalThis.Buffer = Buffer;

// const headers = {
//   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
// }
// const headers = { 'Content-Type': 'multipart/form-data' };

export default {
  name: "Upload",
  data() {
    return {
      form: {
        email: '',
        passwordFile: '',
        file: null
      }
    }
  },
  methods: {
    handleFileUpload(){
      this.form.file = this.$refs.file.files[0];
    },
    upload: function () {
      const cookieIDpengirim = Vue.$cookies.get("id_user");
      const emailTujuan = this.form.email;
      const fileToEncrypt = this.form.file;
      const passwordFile = this.form.passwordFile;

      axios({
        method: 'get',
        url: 'http://localhost:3000/getPubKey/' + emailTujuan
      })
      .then(function (response) {
        let publicKeyResponse = response.data.pubkey;
        
        if(fileToEncrypt.name.includes(".txt")){
          enkrip();
          async function enkrip() {
            let buff = Buffer.from(publicKeyResponse, 'base64');
            let publicKeyArmored = buff.toString('utf-8');
            var textRead = await fileToEncrypt.text();
            var fileName = fileToEncrypt.name;

            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

            const encrypted = await openpgp.encrypt({
              message: await openpgp.createMessage({text: textRead}),
              encryptionKeys: publicKey
            });

            const formData = new FormData();
            formData.append('file', encrypted);
            formData.append('file_name', fileName);
            formData.append('email', emailTujuan);
            formData.append('id_pengirim', cookieIDpengirim);
            axios.post("http://localhost:3000/file/encryption", formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((res) => {
              if (res.data.message === "Validation Failed") {
                let errors = res.data.errors;
                let errorMsg = "";
                if (errors.email.length != 0) {
                  for (let i = 0; i < errors.email.length; i++) {
                    errorMsg += `${errors.email[i]}\n`;
                  }
                }
                alert(errorMsg);
              }
              else {
                let kode_download = res.data.download_code;
                alert("Upload Sukses! Ini kode download anda : " + kode_download)
              }
            }).catch((error) => {
              console.log(error);
            })
          };
        }else if(fileToEncrypt.name.includes(".zip")){
          enkrip();
          async function enkrip() {
            var fileName = fileToEncrypt.name;
            var binaryRead = new Uint8Array(await fileToEncrypt.arrayBuffer());
            
            const message = await openpgp.createMessage({ binary: binaryRead });
            const encrypted = await openpgp.encrypt({
              message, // input as Message object
              passwords: [passwordFile], // multiple passwords possible
              format: 'binary' // don't ASCII armor (for Uint8Array output)
            });

            var blob_encrypted = new Blob([encrypted]);
            console.log(blob_encrypted);

            const formData = new FormData();
            formData.append('file', blob_encrypted);
            formData.append('email', emailTujuan);
            formData.append('file_name', fileName);
            formData.append('id_pengirim', cookieIDpengirim);
            axios.post("http://localhost:3000/file/encryption", formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((res) => {
              if (res.data.message === "Validation Failed") {
                let errors = res.data.errors;
                let errorMsg = "";
                if (errors.email.length != 0) {
                  for (let i = 0; i < errors.email.length; i++) {
                    errorMsg += `${errors.email[i]}\n`;
                  }
                }
                alert(errorMsg);
              }
              else {
                let kode_download = res.data.download_code;
                alert("Upload Sukses! Ini kode download anda : " + kode_download)
              }
            }).catch((error) => {
              console.log(error);
            })
          }
        }
      });

      //untuk enkripsi butuh public key berarti butuh mendapatkan public key dari penerima dulu
      //proses enkripsi dulu baru upload
    }
  }
};
</script>