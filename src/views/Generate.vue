<script>
import Footer from '../components/Footer.vue'
</script>

<template>
  <main>
    <body class="body-location">
      <form action="">
        <h2>Generate Key</h2>
        <label for="passphrase">Name :</label><br/>
        <input type="text" id="name" name="name"/><br/>
        <label for="passphrase">Passphrase :</label><br/>
        <input type="text" id="passphrase" name="passphrase"/><br/>
        <input type="submit" value="generateKey" @click="generateKey()"/><br/>
      </form>
    <Footer />
    </body>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: "Generate",
  data() {
    return{
      name: "",
      passphrase: ""
    }
  },
  methods: {
    generateKey: function() {
      axios.get("/key/generate", {
        name: this.name,
        passphrase: this.passphrase
      }).then((res) => {
        if(res.data.msg === "Generate Failed"){
          let errors = res.data.errors;
          let errorMsg = "";
          if(errors.name.length != 0){
            for(let i=0; i<errors.name.length; i++){
              errorMsg += `${errors.name[i]}\n`;
            }
          }
          if(errors.passphrase.length != 0){
            for(let i=0; i<errors.passphrase.length; i++){
              errorMsg += `${errors.passphrase[i]}\n`;
            }
          }
          alert(errorMsg);
        }
        else{
          alert("Successfully Generated");
        }
      }).catch((e)=>{
        alert(e);
      })
    }
  }
};
</script>

<style scoped>
.body-location{
    min-height: 0vh;
    background-color: transparent;
    color: black;
    height: 320px;
}

</style>