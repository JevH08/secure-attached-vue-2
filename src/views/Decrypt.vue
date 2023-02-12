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
            </b-row>
        </b-container>
    </footer>
    </div>
  </main>
</template>
  
<script>
import axios from 'axios';
import FileSaver  from 'file-saver';
import Vue from 'vue';

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
      const formData = new FormData();
      formData.append('down_code', this.form.down_code);
      formData.append('pass_txt', this.form.pass_txt);
      formData.append('key', this.form.key);
      formData.append('id_penerima', cookieIDpenerima);
      axios.post("http://localhost:3000/file/decryption", formData,
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
          if(res.data.message == "zip"){
            let download_link = res.data.download_link;
            axios({
              method: 'get',
              url: 'http://localhost:3000/download/' + download_link,
              responseType: 'blob'
            })
            .then(function (response) {
              console.log(response.data);
              var blob = new Blob([response.data], {type: "application/zip"});
              FileSaver.saveAs(blob, "download.zip");
            });
          }else if(res.data.message == "txt"){
            //code untuk respon txt here
            var blob = new Blob([res.data.file], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "decrypted_message.txt");
          }
          //gg ini berhasil
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }
};
</script>