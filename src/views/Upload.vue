<template>
  <main>
    <div class="container">
      <form v-on:submit.prevent="upload()" enctype="multipart/form-data">
        <h2>Encrypt dan Upload</h2>
        <label for="email">E-Mail Tujuan : </label>
        <input type="text" v-model="form.email" /><br />
        <label for="file">File : </label>
        <input type="file" ref="file" v-on:change="handleFileUpload()" /><br />
        <label for="email">File Password: </label>
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
            </b-row>
        </b-container>
    </footer>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

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
      const formData = new FormData();
      formData.append('file', this.form.file);
      formData.append('email', this.form.email);
      formData.append('passwordFile', this.form.passwordFile);
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
          let kode_download = res.data.download_link;
          alert("Upload Sukses! Ini kode download anda : " + kode_download)
          //gg ini berhasil
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }
};
</script>