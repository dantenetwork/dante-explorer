<template>
  <v-container>
    <div>安装状态: {{ installed }}</div>
    <div>连接状态: {{ connected }}</div>
    <div>当前选择的地址为: {{ address }}</div>

    <v-btn class="ma-2" color="secondary" @click="transferClick">
      转账测试
    </v-btn>
  </v-container>
</template>


<script>
export default {
  name: "Wallet",
  data: () => ({
    status: false,
    installed: "未安装 Samurai",
    connected: "未连接到 Samurai",
    address: "",
  }),

  created() {
    if (typeof window.platon !== "undefined") {
      console.log("Samurai is installed!");
      this.installed = "已安装 Samurai";

      // connect to samurai wallet
      const platon = window.platon;

      platon
        .request({ method: "platon_requestAccounts" })
        .then(() => {
          this.connected = "已连接到 Samurai";
          this.address = platon.selectedAddress;
          this.status = true;
        })
        .catch((error) => {
          if (error.code === 4001) {
            console.log("Please connect to Samurai.");
          } else {
            console.error(error);
          }
        });
    }
  },
  methods: {
    transferClick() {
      if (!this.status) {
        alert("请先连接到 Samurai 钱包");
        return;
      }
      window.web3a.platon.sendTransaction(
        {
          from: window.platon.selectedAddress,
          to: "lat1dt2wx0xjkd2je8ev4t3ysmte6n90kc9gzndwuv",
          value: 1e16,
        },
        function (err, transactionHash) {
          if (err) {
            console.log(err);
          } else {
            console.log(transactionHash);
          }
        }
      );
    },
  },
};
</script>