<template>
  <v-container>
    <br />
    <v-toolbar-title>存储节点详细信息</v-toolbar-title>
    <br />
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr v-for="item in providerInfo" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <br /><br />

    <v-toolbar-title>存储节点投票列表</v-toolbar-title>
    <br />
    <v-data-table
      :headers="headers"
      :items="voters"
      hide-default-footer
      class="elevation-1"
      @click:row="handleClick"
    ></v-data-table>
    <br /><br />
  </v-container>
</template>


<script>
export default {
  name: "Provider",
  data: () => ({
    providerInfo: [
      {
        name: "名称",
        value: "Google",
      },
      {
        name: "IPFS Peer Id",
        value: "lat1fs9m6p59antawy7u2g5kx4xkaup78m0m2pu27y",
      },
      {
        name: "所在地区",
        value: "072",
      },
      {
        name: "待领取奖励",
        value: "10000",
      },
      {
        name: "SGX 公钥",
        value:
          "0474c4ecda8d528a5adf2810b27c174be17c86e263a0998f380a42f4a2eb350fc54fb341146a6305ba436bc933402f9868d01338acc7abd81854c28b14781b78a1",
      },
      {
        name: "接收奖励地址",
        value: "lat1fs9m6p59antawy7u2g5kx4xkaup78m0m2pu27y",
      },
      {
        name: "区块链账号",
        value: "lat1fs9m6p59antawy7u2g5kx4xkaup78m0m2pu27y",
      },
      {
        name: "抵押数量",
        value: "1000000 DAT",
      },
      {
        name: "任务空间大小",
        value: 0,
      },
      {
        name: "空闲空间大小",
        value: 0,
      },
      {
        name: "上传区块号",
        value: 0,
      },
      {
        name: "存储证明签名",
        value:
          "0x6218ff2883e9ee97e29da6a3d6fe0f59081c2de9143b8dee336059c67fc249d965dbc3e5f6d3f0ae598d6be97c39a7a204d0636e50b0d56677eec7d84267c92801",
      },
      {
        name: "时间戳",
        value: 0,
      },
    ],
    headers: [
      {
        text: "投票人地址",
        align: "start",
        sortable: false,
        value: "voter",
      },
      { text: "DAT 数量", value: "amount" },
      { text: "区块号", value: "block_num" },
    ],
    voters: [
      {
        voter: "lat1fs9m6p59antawy7u2g5kx4xkaup78m0m2pu27y",
        amount: "1000 LAT",
        block_num: "3000000",
      },
    ],
  }),
  created() {
    this.fetchData(this.$route.params.enclavePublicKey);
  },
  methods: {
    fetchData(enclavePublicKey) {
      console.log(enclavePublicKey);
    },
    handleClick(value) {
      console.log(value);
    },
  },
};
</script>

<style>
.v-data-table__wrapper table tr td {
  font-size: 1rem;
}
</style>