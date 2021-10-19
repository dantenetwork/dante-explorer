<template>
  <v-container>Deal </v-container>
</template>


<script>
export default {
  name: "Deal",
  data: () => ({}),
  created() {
    console.log(this.$route.params.dealId);
    this.fetchData(this.$route.params.dealId);
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