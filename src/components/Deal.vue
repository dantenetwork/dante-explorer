<template>
  <v-container>
    <br />
    <v-toolbar-title>订单详细信息</v-toolbar-title>
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
            <tr v-for="item in dealInfo" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <br /><br />

      <v-toolbar-title>已接单的存储节点列表</v-toolbar-title>
      <br />
      <v-data-table
        :headers="headers"
        :items="storageProviderList"
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
export default {
  name: "Deal",
  data: () => ({
    loading: true,
    dealInfo: [],
    storageProviderPubKeyList: [],
    headers: [
      {
        text: "SGX 公钥",
        align: "start",
        sortable: false,
        value: "enclavePublicKey",
      },
    ],
    storageProviderList: [],
  }),
  created() {
    // get opened deal
    this.$http
      .get("http://127.0.0.1:8081/deal/" + this.$route.params.dealId)
      .then(
        function (res) {
          if (res.status == 200) {
            const ret = res.body;
            let dealInfo = [];
            const nameArray = [
              "订单 ID",
              "订单状态",
              "节点是否被罚没",
              "订单文件大小",
              "订单价格",
              "订单周期",
              "订单结束区块号",
              "订单发起人",
              "需要存储节点的数量",
              "订单总奖励",
              "订单剩余奖励",
              "已接单存储节点数量",
            ];

            for (let i = 0; i < ret.length; i++) {
              let value = ret[i];
              if (i == 1) {
                value = ["等待接单", "已接满", "已到期", "非法订单"][value];
              } else if (i == 2) {
                value = ["未被罚没", "已被罚没"][value];
              } else if (i == 3) {
                value = value + " Byte";
              } else if (i == 4) {
                value = value / UNIT + " DAT";
              } else if (i == 5) {
                value = value + " 个区块";
              } else if (i == 9 || i == 10) {
                value = value / UNIT + " DAT";
              } else if (i == 11) {
                for (let i = 0; i < value.length; i++) {
                  this.storageProviderList.push({ enclavePublicKey: value[i] });
                }
                value = this.storageProviderList.length;
              }
              dealInfo.push({
                name: nameArray[i],
                value: value,
              });
            }
            this.dealInfo = dealInfo;
            this.loading = false;
          }
        },
        function (error) {
          console.log(error);
        }
      );
  },
  methods: {
    handleClick(provider) {
      // navigate to provider info pages
      this.$router.push({
        name: "provider",
        params: { enclavePublicKey: provider.enclavePublicKey },
      });
    },
  },
};
</script>