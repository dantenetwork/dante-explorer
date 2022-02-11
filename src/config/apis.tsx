export const api = {
  common: {
    uploadFile: '/uploadFile',
  },
  home: {
    global_info: '/global_info',
  },
  storage: {
    list: '/storage/list',
    detail: '/storage/detail',
    orderReward: '/storage/reward',
    minerlist: '/storage/minerlist',
    convertHexadecimal: '/storage/convertHexadecimal',
    encodeTokenApprove: '/storage/encode_token_approve',
    encodeStakeToken: '/storage/encode_stake_token',
  },
  order: {
    addDeal: '/add_deal',
    deal: '/deal',
  },
  center: {
    stakeList: '/center/stake_list',
    mining_reward_balance: '/get_mining_reward_balance',
    total_mining_reward: '/center/total_mining_reward',
    claim_stake_reward: '/center/claim_stake_reward',
    unstake_token: '/center/unstake_token', //赎回
    unstake: '/center/unstake',
    fileList: '/center/file_list',
  },
  balance: '/balance',
  config: '/config',
};
