<template>
  <v-container>
    <br />
    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">
          {{ mining.prePeriodTotalReward }}
        </p>
        <div class="text--primary">上一周期总奖励</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">
          {{ mining.prePeriodRemainReward }}
        </p>
        <div class="text--primary">上一周期未领取奖励</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">
          {{ mining.prePeriodTotalCapacity }}
        </p>
        <div class="text--primary">上一周期总空间</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">
          {{ mining.prePeriodTotalTaskReward }}
        </p>
        <div class="text--primary">上一周期任务空间奖励</div>
      </v-card-text>
    </v-card>

    <v-card class="d-inline-flex ma-5" max-width="200">
      <v-card-text>
        <p class="text-h5 text--primary">
          {{ mining.prePeriodTotalIdleReward }}
        </p>
        <div class="text--primary">上一周期空闲空间奖励</div>
      </v-card-text>
    </v-card>
    <br /><br /><br /><br />
    <v-toolbar-title>订单列表</v-toolbar-title>
    <br />

    <v-data-table
      :headers="headers"
      :items="deals"
      :page.sync="page"
      hide-default-footer
      class="elevation-1"
      @click:row="handleClick"
      @page-count="pageCount = $event"
    ></v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-container>
</template>


<script>
export default {
  name: "Home",
  created() {
    const UNIT = 1000000000000000000;
    this.$http.get("http://127.0.0.1:8081/mining").then(
      function (res) {
        if (res.status == 200) {
          // calculate reward & capacity
          const prePeriodTotalReward = (res.body[2] / UNIT).toFixed(0);
          const prePeriodRemainReward = (res.body[3] / UNIT).toFixed(0);
          const prePeriodTotalCapacity = (res.body[7] / 1024) * 1024 * 1024;
          const prePeriodTotalTaskReward = (res.body[6] / UNIT).toFixed(0);
          const prePeriodTotalIdleReward = (res.body[5] / UNIT).toFixed(0);

          // formate reward & capcacity
          let mining = {
            prePeriodTotalReward:
              Number(prePeriodTotalReward).toLocaleString() + " DAT",
            prePeriodRemainReward:
              Number(prePeriodRemainReward).toLocaleString() + " DAT",
            prePeriodTotalCapacity: Number(prePeriodTotalCapacity) + " GB",
            prePeriodTotalTaskReward: Number(prePeriodTotalTaskReward) + " DAT",
            prePeriodTotalIdleReward: Number(prePeriodTotalIdleReward) + " DAT",
          };
          this.mining = mining;
        }
      },
      function (error) {
        console.log(error);
      }
    );
  },
  data: () => ({
    mining: {},
    page: 1,
    pageCount: 1,
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
  methods: {
    handleClick(deal) {
      // navigate to deal info pages
      this.$router.push({ name: "deal", params: { dealId: deal.cid } });
    },
  },
};
</script>