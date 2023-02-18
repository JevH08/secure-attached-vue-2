<template>
  <main>
    <body class="body-location">
      <div class="container">
        <div class="container">
          <h3 class="p-3 text-center">Upload History</h3>
          <table class="table table-striped table-bordered">
              <thead>
                  <tr>
                      <th>Download Code</th>
                      <th>Tanggal Upload</th>
                      <th>Penerima</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="history in histories" :key="history.id">
                      <td>{{history.link}}</td>
                      <td>{{history.time}}</td>
                      <td>{{history.username}}</td>
                  </tr>
              </tbody>
          </table>
        </div>
        
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
    </body>
  </main>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

export default {
  name: "History",
    data() {
      const id_pengirim = Vue.$cookies.get("id_user");
      let responses = [];
      let historiesNew = [];
      axios({
        method: 'get',
        url: 'http://localhost:3000/upload/history/' + id_pengirim
      })
      .then(function (response) {
        responses = response.data.history;
        responses.forEach(element => {
          let history = {id: element.history_id, link: element.history_link, time: element.history_time.substr(0,10), username: element.pengguna_username}
          historiesNew.push(history);
        });
      });
      return {
        histories: historiesNew
      };
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