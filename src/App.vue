<template>
  <v-app>
    <v-app-bar app color="primary" dark> Dante Explorer</v-app-bar>
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script>
import Home from "./components/Home";

export default {
  name: "App",
  components: {
    Home,
  },
};
</script>
