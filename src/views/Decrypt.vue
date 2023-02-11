<template>
  <main>
    <div class="container">
      <form v-on:submit.prevent="download()" enctype="multipart/form-data">
        <h2>Decrypt dan Download</h2>
        <label for="download_code">Kode Download : </label>
        <input type="text" v-model="form.down_code" /><br />
        <label for="password_file">Password File (jika .zip) : </label>
        <input type="text" v-model="form.pass_txt" /><br />
        <label for="file">Private Key (jika .txt) : </label>
        <input type="file" ref="privateKey" v-on:change="handleKeyUpload()" /><br />
        <input type="button" value="Download" v-on:click="download()" /><br />
      </form>
    <Footer />
    </div>
  </main>
</template>
  
<script>
import axios from 'axios';
import FileSaver  from 'file-saver';

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
      const formData = new FormData();
      formData.append('down_code', this.form.down_code);
      formData.append('pass_txt', this.form.pass_txt);
      formData.append('key', this.form.key);
      axios.post("http://localhost:3000/file/decryption", formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }, 
        responseType: 'blob'
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
          let decryptedFile = res.data.file;
          console.log(decryptedFile);

          // let arraybuffer = Uint8Array.from(decryptedFile).buffer;
          // console.log(arraybuffer);

          FileSaver.saveAs(decryptedFile, "download.zip");
          //gg ini berhasil
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }
};
</script>