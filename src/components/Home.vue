<template>
  <v-container>
    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">654,109,876</p>
        <div class="text--primary">上一周期网络空间大小</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">654,109,876</p>
        <div class="text--primary">上一周期节点存储大小</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">654,109,876</p>
        <div class="text--primary">上一周期结束区块号</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">654,109,876</p>
        <div class="text--primary">上一周期总奖励</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">654,109,876</p>
        <div class="text--primary">上一周期未领取奖励</div>
      </v-card-text>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="deals"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>


<script>
export default {
  name: "Home",
  data: () => ({
    headers: [
      {
        text: "订单 ID",
        align: "start",
        sortable: false,
        value: "cid",
      },
      { text: "订单状态", value: "state" },
      { text: "订单总奖励", value: "total_reward" },
      { text: "订单剩余奖励", value: "reward_balance" },
      { text: "发起人", value: "sender" },
    ],
    deals: [
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
      {
        cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb",
        state: 2,
        sender: "lat15nqll7dfn4km00lz6nd4ahxya5gals9d2f7sn8",
        total_reward: 3000000,
        reward_balance: 3000000,
      },
    ],
  }),
};
</script>


<style>
.card-gap {
  margin: 20px;
}
</style>