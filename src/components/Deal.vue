<template>
  <v-container>
    <br />
    <v-toolbar-title>订单详细信息</v-toolbar-title>
    <br />
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
      :items="deals"
      hide-default-footer
      class="elevation-1"
      @click:row="handleClick"
    ></v-data-table>
    <br /><br />
  </v-container>
</template>


<script>
export default {
  name: "Deal",
  data: () => ({
    dealInfo: [
      {
        name: "IPFS cid",
        value: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
      },
      {
        name: "订单状态",
        value: 0,
      },
      {
        name: "节点是否被罚没",
        value: 0,
      },
      {
        name: "订单文件大小",
        value: 0,
      },
      {
        name: "订单价格",
        value: 0,
      },
      {
        name: "订单周期",
        value: 0,
      },
      {
        name: "订单结束区块号",
        value: 0,
      },
      {
        name: "订单发起人",
        value: 0,
      },
      {
        name: "订单总奖励",
        value: 0,
      },
      {
        name: "订单剩余奖励",
        value: 0,
      },
      {
        name: "需要存储节点的数量",
        value: 0,
      },
      {
        name: "已接单存储节点数量",
        value: 1,
      },
    ],
    headers: [
      {
        text: "名称",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Peer ID", value: "peer_id" },
      { text: "所在地区", value: "country_code" },
      { text: "网站", value: "url" },
      { text: "区块链账号", value: "sender" },
    ],
    deals: [
      {
        enclavePublicKey:
          "0474c4ecda8d528a5adf2810b27c174be17c86e263a0998f380a42f4a2eb350fc54fb341146a6305ba436bc933402f9868d01338acc7abd81854c28b14781b78a1",
        name: "Google",
        peer_id: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        country_code: "072",
        url: "https://google.com",
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
      },
    ],
  }),
  created() {
    console.log(this.$route.params.dealId);
    this.fetchData(this.$route.params.dealId);
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
    },
    handleClick(provider) {
      console.log(provider);
      // navigate to provider info pages
      this.$router.push({
        name: "provider",
        params: { enclavePublicKey: provider.enclavePublicKey },
      });
    },
  },
};
</script>