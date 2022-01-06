<template>
  <v-container>
    <div>安装状态: {{ installed }}</div>
    <div>连接状态: {{ connected }}</div>
    <div>当前选择的地址为: {{ selectedAddress }}</div>
    <div>DAT 余额: {{ DATBalance }}</div>

    <v-btn class="ma-2" color="secondary" @click="transferDAT">
      DAT 转账测试
    </v-btn>
  </v-container>
</template>


<script>
// init DAT contract
const testNetwork = "http://35.247.155.162:6789";
var Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider(testNetwork));

const contractAddress = "lat142epzrcpcsdelvzmv3e05mzurj8jtx4mutqpw3";
const contractAddressHex = web3.utils.decodeBech32Address(
  contractAddress,
  "lat"
);
console.log(contractAddressHex);
const abi =
  '[{"constant":true,"input":[],"name":"getOwner","output":"string","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"burn","output":"bool","type":"Action"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"},{"name":"_spender","type":"FixedHash<20>"}],"name":"allowance","output":"uint128","type":"Action"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Transfer","topic":2,"type":"Event"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Approval","topic":2,"type":"Event"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"}],"name":"balanceOf","output":"uint128","type":"Action"},{"constant":false,"input":[{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transfer","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_from","type":"FixedHash<20>"},{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transferFrom","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_spender","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"approve","output":"bool","type":"Action"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"string"},{"name":"arg2","type":"string"}],"name":"Mint","topic":1,"type":"Event"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Burn","topic":1,"type":"Event"},{"constant":false,"input":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"name":"init","output":"void","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"mint","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"}],"name":"setOwner","output":"bool","type":"Action"},{"constant":true,"input":[],"name":"getName","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getDecimals","output":"uint8","type":"Action"},{"constant":true,"input":[],"name":"getSymbol","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getTotalSupply","output":"uint128","type":"Action"}]';
const DATContract = new web3.platon.Contract(JSON.parse(abi), contractAddress, {
  vmType: 1,
});

export default {
  name: "Wallet",
  data: () => ({
    status: false,
    installed: "未安装 Samurai",
    connected: "未连接到 Samurai",
    DATBalance: 0,
    selectedAddress: "",
    ethereum: null,
  }),
  async created() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      this.installed = "已安装 MetaMask";
      // connect to MetaMask wallet
      this.ethereum = window.ethereum;
      this.selectedAddress = this.ethereum.selectedAddress;

      await this.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async () => {
          this.connected = "已连接到 MetaMask";
          this.selectedAddress = web3.utils.toBech32Address(
            "lat",
            this.selectedAddress
          );
          this.status = true;
          this.refreshBalance();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  methods: {
    async refreshBalance() {
      // query DAT balance
      const balance = await DATContract.methods
        .balanceOf(this.selectedAddress)
        .call({});
      console.log("balance: " + balance);
      this.DATBalance = balance;
    },
    async transferDAT() {
      if (!this.status) {
        alert("请先连接到 Samurai 钱包");
        return;
      }

      const receiver = "lat1dt2wx0xjkd2je8ev4t3ysmte6n90kc9gzndwuv";
      const ONE_TOKEN = "1000000000000000000";

      let data = DATContract.methods["transfer"]
        .apply(DATContract.methods, [receiver, ONE_TOKEN])
        .encodeABI();

      const selectedAddressHex = await web3.utils.decodeBech32Address(
        this.selectedAddress,
        "lat"
      );
      console.log(this.selectedAddress);
      console.log(selectedAddressHex);
      const transactionParameters = {
        nonce: "0x00", // ignored by MetaMask
        gasPrice: "0x4A817C800", // customizable by user during MetaMask confirmation.
        gas: "0xF4240", // customizable by user during MetaMask confirmation.
        to: contractAddressHex, // Required except during contract publications.
        from: selectedAddressHex, // must match user's active address.
        value: "0x00", // Only required to send ether to the recipient from the initiating external account.
        data: data, // Optional, but used for defining smart contract creation and interaction.
        chainId: "210309", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      console.log(transactionParameters);

      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await this.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log(txHash);
    },
  },
};
</script>