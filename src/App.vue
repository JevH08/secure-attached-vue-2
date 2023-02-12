<script setup>
</script>

<template>
  <div id="app">
    <div class="container-main">
      <body class="body-location">
        <router-view />
        
      </body>
    </div>
  </div>
</template>

<!-- Router view adalah halaman yang ada di views ketika router link di click maka
akan berubah sesuai route nya -->

<style scoped>
.container-main {
  width: 600px;
  height: 400px;
  padding: 8px;
  background-image: url('/assets/images/background.jpg');
}
.body-location{
  min-height: 0vh;
  background-color: transparent;
  color: black;
  height: 320px;
}
</style>
