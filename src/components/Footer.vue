<script setup>
</script>

<template>
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
</template>

<style scoped>
.foot {
  background-color: darkgrey;
  opacity: 0.75;
  padding-top: 4px;
  padding-bottom: 4px;
  display: flex;
  flex-wrap: wrap;
  padding: 0.75rem;
  font-size: large;
  position: absolute;
  width: 580px;
  margin-top: 170px;
}
.item{
margin-left: auto;
margin-right: auto;
}
.dark-blue{
  color: #2c3e50;
}
</style>