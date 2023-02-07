<template>
  <main>
    <div class="container">
      <form v-on:submit.prevent="upload()" enctype="multipart/form-data">
        <h2>Encrypt dan Upload</h2>
        <label for="email">E-Mail Tujuan : </label>
        <input type="text" v-model="form.email" /><br />
        <label for="file">File : </label>
        <input type="file" ref="file" v-on:change="handleFileUpload()" /><br />
        <input type="button" value="Upload" v-on:click="upload()" /><br />
      </form>
    <Footer />
    </div>
  </main>
</template>

<script>
import axios from 'axios';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
}
// const headers = { 'Content-Type': 'multipart/form-data' };

export default {
  name: "Upload",
  data() {
    return {
      form: {
        email: '',
        file: null
      }
    }
  },
  methods: {
    handleFileUpload(){
      this.form.file = this.$refs.file.files[0];
    },
    upload: function () {
      const formData = new FormData();
      formData.append('file', this.form.file);
      formData.append('email', this.form.email);
      alert(formData);
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