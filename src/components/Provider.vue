<template>
  <v-container>Provider </v-container>
</template>


<script>
export default {
  name: "Deal",
  data: () => ({}),
  created() {
    console.log(this.$route.params.providerPublickKey);
    this.fetchData(this.$route.params.providerPublickKey);
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
    },
    handleClick(value) {
      console.log(value);
    },
  },
};
</script>