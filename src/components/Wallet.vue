<template>
  <v-container>
    <div>安装状态: {{ installed }}</div>
    <div>连接状态: {{ connected }}</div>
    <div>当前选择的地址为: {{ selectedAddress }}</div>
    <div>DAT 余额: {{ DATBalance }}</div>

    <v-btn class="ma-2" color="secondary" @click="transferLAT">
      LAT 转账测试
    </v-btn>
    <v-btn class="ma-2" color="secondary" @click="transferDAT">
      DAT 转账测试
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
    DATContract: null,
    DATBalance: 0,
    selectedAddress: "",
  }),
  async created() {
    if (typeof window.platon !== "undefined") {
      console.log("Samurai is installed!");
      this.installed = "已安装 Samurai";

      // init DAT contract
      var Web3A = require("web3");
      const abi =
        '[{"constant":true,"input":[],"name":"getOwner","output":"string","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"burn","output":"bool","type":"Action"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"},{"name":"_spender","type":"FixedHash<20>"}],"name":"allowance","output":"uint128","type":"Action"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Transfer","topic":2,"type":"Event"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Approval","topic":2,"type":"Event"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"}],"name":"balanceOf","output":"uint128","type":"Action"},{"constant":false,"input":[{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transfer","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_from","type":"FixedHash<20>"},{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transferFrom","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_spender","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"approve","output":"bool","type":"Action"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"string"},{"name":"arg2","type":"string"}],"name":"Mint","topic":1,"type":"Event"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Burn","topic":1,"type":"Event"},{"constant":false,"input":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"name":"init","output":"void","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"mint","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"}],"name":"setOwner","output":"bool","type":"Action"},{"constant":true,"input":[],"name":"getName","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getDecimals","output":"uint8","type":"Action"},{"constant":true,"input":[],"name":"getSymbol","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getTotalSupply","output":"uint128","type":"Action"}]';
      var web3platon = new Web3A(window.platon);
      this.DATContract = new web3platon.platon.Contract(
        JSON.parse(abi),
        "lat142epzrcpcsdelvzmv3e05mzurj8jtx4mutqpw3",
        { vmType: 1 }
      );

      // connect to samurai wallet
      const platon = window.platon;

      platon
        .request({ method: "platon_requestAccounts" })
        .then(async () => {
          this.connected = "已连接到 Samurai";
          this.selectedAddress = platon.selectedAddress;
          this.status = true;
          this.refreshBalance();
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
    async refreshBalance() {
      // query DAT balance
      const balance = await this.DATContract.methods
        .balanceOf(this.selectedAddress)
        .call({});
      this.DATBalance = balance;
    },
    transferLAT() {
      if (!this.status) {
        alert("请先连接到 Samurai 钱包");
        return;
      }
      window.web3a.platon.sendTransaction(
        {
          from: window.platon.selectedAddress,
          to: "lat1dt2wx0xjkd2je8ev4t3ysmte6n90kc9gzndwuv",
          value: "10000000000000000",
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
    transferDAT() {
      if (!this.status) {
        alert("请先连接到 Samurai 钱包");
        return;
      }

      this.DATContract.methods
        .transfer(
          "lat1dt2wx0xjkd2je8ev4t3ysmte6n90kc9gzndwuv",
          "1000000000000000000"
        )
        .send({ from: window.platon.selectedAddress })
        .then((receipt) => {
          console.log("receipt: ", receipt);
          this.refreshBalance();
        })
        .catch(function (err) {
          console.log("error: ", err);
        });
    },
  },
};
</script>