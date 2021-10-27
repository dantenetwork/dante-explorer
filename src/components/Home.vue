<template>
  <v-container>
    <br />
    <div class="text-center" v-show="loading">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-show="!loading">
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

      <br /><br />
      <br /><br />

      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="keyword"
                label="请输入订单ID/存储节点公钥"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn class="mr-4" @click="search"> Search </v-btn>
            </v-col>
            <v-col cols="12" md="1"> </v-col>
          </v-row>
        </v-container>
      </v-form>

      <br /><br />
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
    </div>
  </v-container>
</template>


<script>
const UNIT = 1000000000000000000;

export default {
  name: "Home",
  created() {
    // get mining info
    this.$http.get("http://192.168.1.64:8081/mining").then(
      function (res) {
        if (res.status == 200) {
          // calculate reward & capacity
          const prePeriodTotalReward = (res.body[2] / UNIT).toFixed(0);
          const prePeriodRemainReward = (res.body[3] / UNIT).toFixed(0);
          const prePeriodTotalCapacity = (res.body[7] / 1024) * 1024 * 1024;
          const prePeriodTotalTaskReward = (res.body[6] / UNIT).toFixed(0);
          const prePeriodTotalIdleReward = (res.body[5] / UNIT).toFixed(0);

          // format reward & capcacity
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
          this.loading = false;
        }
      },
      function (error) {
        console.log(error);
      }
    );

    // get opened deal
    this.$http.get("http://192.168.1.64:8081/deal").then(
      function (res) {
        if (res.status == 200) {
          this.deals = res.body;
          // format deals info
          for (let i = 0; i < this.deals.length; i++) {
            this.deals[i].state = ["等待接单", "已接满", "已到期", "非法订单"][
              this.deals[i].state
            ];
            this.deals[i].totalReward =
              this.deals[i].totalReward / UNIT + " DAT";
            this.deals[i].rewardBalance =
              this.deals[i].rewardBalance / UNIT + " DAT";
          }
          this.loading = false;
        }
      },
      function (error) {
        console.log(error);
      }
    );
  },
  data: () => ({
    loading: true,
    keyword: "",
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
      { text: "订单总奖励", value: "totalReward" },
      { text: "订单剩余奖励", value: "rewardBalance" },
      { text: "发起人", value: "sender" },
    ],
    deals: [],
  }),
  methods: {
    handleClick(deal) {
      // navigate to deal info pages
      this.$router.push({ name: "deal", params: { dealId: deal.cid } });
    },
    search() {
      const keyword = this.keyword;
      if (keyword.length == 46) {
        this.$router.push({ name: "deal", params: { dealId: keyword } });
      } else if (keyword.length == 130) {
        this.$router.push({
          name: "provider",
          params: { enclavePublicKey: keyword },
        });
      } else {
        alert("查询无结果");
      }
    },
  },
};
</script>