<template>
  <v-container>
    <br />
    <v-toolbar-title>存储节点详细信息</v-toolbar-title>
    <br />
    <div class="text-center" v-show="loading">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-show="!loading">
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
    </div>
  </v-container>
</template>


<script>
const UNIT = 1000000000000000000;
const GB = 1024 * 1024 * 1024;

export default {
  name: "Provider",
  data: () => ({
    loading: true,
    providerInfo: [],
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
    voters: [],
  }),
  created() {
    // query storage provider info
    this.$http
      .get("http://127.0.0.1:8081/miner/" + this.$route.params.enclavePublicKey)
      .then(
        function (res) {
          if (res.status == 200) {
            const ret = res.body;
            // render info
            const providerInfo = [
              {
                name: "节点名称",
                value: ret.minerInfo[1],
              },
              {
                name: "IPFS Peer Id",
                value: ret.minerInfo[2],
              },
              {
                name: "所在地区",
                value: ret.minerInfo[3],
              },
              {
                name: "节点网址",
                value: ret.minerInfo[4],
              },
              {
                name: "SGX 公钥",
                value: ret.miner[0],
              },
              {
                name: "公钥 LAT 格式",
                value: ret.miner[1],
              },
              {
                name: "接收奖励地址",
                value: ret.miner[2],
              },
              {
                name: "区块链账号",
                value: ret.miner[3],
              },
              {
                name: "抵押数量",
                value: ret.miner[4] / UNIT + " DAT",
              },
              {
                name: "抵押存储空间",
                value: ret.miner[5] / GB + " GB",
              },
              {
                name: "委托数量",
                value: ret.miner[6] / UNIT + " DAT",
              },
              {
                name: "委托存储空间",
                value: ret.miner[7] / GB + " GB",
              },
              {
                name: "委托分红比例",
                value: ret.miner[8] + " %",
              },
              {
                name: "存储证明时间戳",
                value: ret.verifyStorageProof[0],
              },
              {
                name: "存储证明任务空间",
                value: ret.verifyStorageProof[1],
              },
              {
                name: "存储证明空闲空间",
                value: ret.verifyStorageProof[2],
              },
              {
                name: "存储证明上传区块号",
                value: ret.verifyStorageProof[3],
              },
              {
                name: "存储证明签名",
                value: ret.verifyStorageProof[4],
              },
              {
                name: "领取奖励区块号",
                value: ret.marketStorageProof[1],
              },
              {
                name: "接单列表",
                value: ret.marketStorageProof[2],
              },
            ];
            this.providerInfo = providerInfo;
            this.loading = false;

            // render stake list
            let voters = [];
            for (let i = 0; i < ret.stakeRecord.length; i++) {
              voters.push({
                voter: ret.stakeRecord[i][0],
                amount: ret.stakeRecord[i][2] / UNIT + " LAT",
                block_num: ret.stakeRecord[i][3],
              });
            }
            this.voters = voters;
          }
        },
        function (error) {
          console.log(error);
        }
      );
  },
  methods: {
    handleClick(value) {
      console.log(value);
    },
  },
};
</script>

<style>
tr td {
  width: 200px;
}
</style>

