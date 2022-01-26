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
    stakeList: '/canter/stake_list',
    total_mining_reward: '/canter/total_mining_reward',
    encodeReceiveToken: '/canter/encode_receive_token',
    encodeStakeToken: '/canter/encode_stake_token',
    unstake: '/canter/unstake',
    fileList: '/canter/file_list',
  },
  balance: '/balance',
  config: '/config',
};
