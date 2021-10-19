<template>
  <v-app>
    <router-link to="/">
      <v-app-bar app color="primary" dark> Dante Explorer </v-app-bar>
    </router-link>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        COPYRIGHT © 2021 DANTE NETWORK
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.text-start:hover {
  cursor: pointer;
}
</style>