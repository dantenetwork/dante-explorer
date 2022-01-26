import React, { useState, useEffect } from 'react';
import styles from './center.less';
// import './node.css'
import { Table, Button, Divider, message, Pagination } from 'antd';
import { Link, connect, history, ConnectProps } from 'umi';
import { config } from '@/config';
import axios from 'axios';
import { get, post } from '@/utils/server';
import { toSize } from '@/utils/utils';
import { api } from '@/config/apis';
const ethereum = window.ethereum;
const { utils, BigNumber } = require('ethers');

interface Item {
  cid: string;
  rewardBalance: string;
  sender: string;
  size: string;
  state: Number;
  totalReward: string;
}

const originData: Item[] = [];

interface stakeItem {
  address: string;
  amount: string;
  enclave_public_key: string;
  stake_block_num: string;
}

const originStakeData: stakeItem[] = [];

function canter(props: any) {
  const [stakeList, setStakeList] = useState(originStakeData);
  const [DATBalance, setDATBalance] = useState(0);
  const [fileList, setFileList] = useState(originData);
  const [stakeLoading, setStakeLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(true);

  const [fileQuery, setFileQuery] = useState({
    total: 0,
    page: 0,
    hasNext: true,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [tbH, setTbH] = useState(400);
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState({
    // key: '',
    totalCapacity: 0,
    taskVolume: '',
    latAddress: '',
    Delegator: 0,
    joinTime: '',
    totalPledge: '',
    entrustedIncome: 0,
    amount: 0,
  });
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    init();
    refreshBalance();
    getFileList();
    getStakeList();
    // getFileList()
    return () => {
      // 需要在 componentWillUnmount 執行的内容
    };
  }, []);

  const refreshBalance = async () => {
    let balance: any = await get(api.balance, {
      selectedAddress: ethereum.selectedAddress,
    });
    setDATBalance(utils.formatUnits(balance, 18));
  };

  const init = async () => {
    console.log(ethereum);
    try {
      let data: any = await get(api.storage.detail, {
        enclave_public_key: ethereum.selectedAddress,
      });
      setDetail(data);
    } catch (error: any) {
      console.log(error);
      // message.error(error);
    }
  };

  const creadOrder = async () => {
    history.push('/order/post');
  };

  const getStakeList = async () => {
    setStakeLoading(true);
    const originData: Item[] = [];

    try {
      let data: any = await get(api.center.stakeList, {
        from: ethereum.selectedAddress,
        skip: 0,
      });

      setStakeList(data);
    } catch (error: any) {
      message.error(error);
    } finally {
      setStakeLoading(false);
    }
  };

  // useEffect(() => {//監聽屏幕
  //   getTbH()
  //   return () => {
  //   };
  // });
  // const getTbH = async ()=> {
  //   const { navHeight, wHeight }: any = props;
  //   const ph: any = document.querySelector('.upagination')?.clientHeight || 0;
  //   const newTbH = wHeight - navHeight - ph - 240;
  //   console.log(wHeight, navHeight, ph);
  //   if (tbH !== newTbH) {
  //     setTbH(newTbH);
  //   }
  // }

  const getFileList = async () => {
    const originData: Item[] = [];
    const { hasNext, total, page } = fileQuery;
    console.log(hasNext, total, page);
    setFileLoading(true);
    try {
      if (!hasNext) return false;
      setLoading(true);
      let data: any = await get(api.center.fileList, {
        sender: ethereum.selectedAddress,
        skip: page,
      });
      console.log(data);
      setFileList(data.list);
      setTotal(data.total);
      if (data.total - page * 10 > 10) {
        setPage(page + 1);
        setHasNext(true);
      } else {
        setHasNext(false);
      }
      setLoading(false);
    } catch (error: any) {
      message.error(error);
      setLoading(false);
    } finally {
      setFileLoading(false);
    }
  };

  // const init = async() =>{
  //   try{
  //     let data:any = await get(api.home.global_info)
  //     console.log(data)
  //     setData((oldData)=>({
  //       ...oldData,
  //       cur_period_total_capacity:Number((data?.globalInfo[9] / 1024) * 1024 * 1024),
  //       nodes_number:data.minerCount
  //     }))
  //   }catch(error:any){
  //     message.error(error);
  //   }

  // }

  const Receive = async () => {
    // const newConfig: any = await get('/config');
    // console.log('666666666', newConfig);
    const selectedAddressHex = props.accountAddress;
    // const contractAddressHex = detail?.senderAddressHex;

    const tokenContractAddressHex = props.config.tokenContractAddressHex;
    // '0xaab2110f01c41b9fb05b6472fa6c5c1c8f259abb';

    const verifyContractAddressHex = props.config.verifyContractAddressHex;
    // '0x82e8570169703a6eacbb7e7f619b6bb1059608fb';

    const tokenApproveData = await get(api.storage.encodeTokenApprove, {
      type: 'verify',
      amount: Number(detail.amount),
    });

    console.log(`tokenApproveData: ${tokenApproveData}`);
    // return false
    const approveTokenParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
      gas: '0xF4240', // customizable by user during MetaMask confirmation.
      to: tokenContractAddressHex, // Required except during contract publications.
      from: selectedAddressHex, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: tokenApproveData, // Optional, but used for defining smart contract creation and interaction.
      chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    console.log(approveTokenParameters);
    // send approve transaction
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const approveTxHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [approveTokenParameters],
    });
    console.log(approveTxHash);

    const stakeTokenData = await get(api.center.total_mining_reward, {});
    // '0xf89688a6e7356e85fe65cfb88230343734633465636461386435323861356164663238313062323763313734626531376338366532363361303939386633383061343266346132656233353066633534666233343131343661363330356261343336626339333334303266393836386430313333386163633761626438313835346332386231343738316237386131880de0b6b3a7640000';
    console.log('stakeTokenData：', stakeTokenData);
    const stakeTokenParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
      gas: '0xF4240', // customizable by user during MetaMask confirmation.
      to: verifyContractAddressHex, // Required except during contract publications.
      from: selectedAddressHex, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: stakeTokenData, // Optional, but used for defining smart contract creation and interaction.
      chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    console.log(stakeTokenParameters);

    // send stake token transaction

    setTimeout(async function () {
      const stakeTxHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [stakeTokenParameters],
      });
      getStakeList();
      console.log(stakeTxHash);
    }, 2000);
  };

  const ransom = async (row: any) => {
    // const newConfig: any = await get('/config');
    // console.log('666666666', newConfig);
    const selectedAddressHex = props.accountAddress;
    // const contractAddressHex = detail?.senderAddressHex;

    const tokenContractAddressHex = props.config.tokenContractAddressHex;
    // '0xaab2110f01c41b9fb05b6472fa6c5c1c8f259abb';

    const verifyContractAddressHex = props.config.verifyContractAddressHex;
    // '0x82e8570169703a6eacbb7e7f619b6bb1059608fb';

    const tokenApproveData = await get(api.storage.encodeTokenApprove, {
      type: 'verify',
      amount: Number(row.amount),
    });

    console.log(`tokenApproveData: ${tokenApproveData}`);
    // return false
    const approveTokenParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
      gas: '0xF4240', // customizable by user during MetaMask confirmation.
      to: tokenContractAddressHex, // Required except during contract publications.
      from: selectedAddressHex, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: tokenApproveData, // Optional, but used for defining smart contract creation and interaction.
      chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    console.log(approveTokenParameters);
    // send approve transaction
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const approveTxHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [approveTokenParameters],
    });
    console.log(approveTxHash);

    const stakeTokenData = await get(api.center.encodeStakeToken, {
      enclave_public_key: row.enclave_public_key,
      amount: Number(row.amount),
    });
    // '0xf89688a6e7356e85fe65cfb88230343734633465636461386435323861356164663238313062323763313734626531376338366532363361303939386633383061343266346132656233353066633534666233343131343661363330356261343336626339333334303266393836386430313333386163633761626438313835346332386231343738316237386131880de0b6b3a7640000';
    console.log('stakeTokenData：', stakeTokenData);
    const stakeTokenParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
      gas: '0xF4240', // customizable by user during MetaMask confirmation.
      to: verifyContractAddressHex, // Required except during contract publications.
      from: selectedAddressHex, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: stakeTokenData, // Optional, but used for defining smart contract creation and interaction.
      chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    console.log(stakeTokenParameters);

    // send stake token transaction

    setTimeout(async function () {
      const stakeTxHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [stakeTokenParameters],
      });
      getStakeList();
      console.log(stakeTxHash);
    }, 2000);
  };

  const stakeColumns: any[] = [
    {
      title: 'from',
      dataIndex: 'address',
      width: '30%',
      editable: true,
      align: 'center', // 设置文本居中的属性
    },
    {
      title: '节点名称',
      dataIndex: 'enclave_public_key',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '区块号',
      dataIndex: 'stake_block_num',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'key',
      width: '20%',
      align: 'center',
      fixed: 'none',
      render: (key: string, row: object) => (
        <a onClick={() => ransom(row)}>赎回</a>
      ),
    },
  ];

  const mergedStakeColumns = stakeColumns.map((col) => {
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        title: col.title,
      }),
    };
  });

  const columns: any[] = [
    {
      title: '订单ID',
      dataIndex: 'cid',
      width: '30%',
      editable: true,
      align: 'center', // 设置文本居中的属性
      render: (cid: any) => (
        <Link to={`/order/detail/${cid}`} className="link">
          {cid}
        </Link>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: '20%',
      editable: true,
      align: 'center',
      // (Number(size) / 1024) / 1024 / 1024
      render: (size: any) => toSize(size),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '有效期至',
      dataIndex: 'overTime',
      width: '20%',
      editable: true,
      align: 'center',
    },
  ];

  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        title: col.title,
      }),
    };
  });
  return (
    <div className={styles.order}>
      <div className={`max-body contain ${styles.contain}`}>
        <div className={styles.txt_row}>
          <div className={styles.txt_title}>账户余额</div>
          <div className={styles.txt_item}>
            <a
              className={styles.txt_item}
              href={`https://scan.platon.network/address-detail?address=${ethereum.selectedAddress}`}
              target="_blank"
            >
              <div className={`${styles.txt_item_title} ${styles.me}`}>
                PlatON
              </div>
              <div className={`${styles.txt_item_val} ${styles.me}`}>
                {Number(DATBalance).toFixed(4) || 0} DAT
              </div>
            </a>
          </div>
          <div className={styles.txt_item}>
            <a
              className={styles.txt_item}
              href={`https://explorer.near.org/accounts/slkrb10.near`}
              target="_blank"
            >
              <div className={`${styles.txt_item_title} ${styles.me}`}>
                NEAR
              </div>
              <div className={`${styles.txt_item_val} ${styles.me}`}>0 DAT</div>
            </a>
          </div>
        </div>
        <div className={styles.txt_row}>
          <div className={styles.txt_title}>待领取收益</div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>PlatON</div>
            <div className={styles.txt_item_val}>{detail.amount} DAT</div>
            <Button
              className="btn_ori"
              type="primary"
              onClick={Receive}
              shape="round"
            >
              领取
            </Button>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>NEAR</div>
            <div className={styles.txt_item_val}>0 DAT</div>
            <Button className="btn_ori" type="primary" shape="round">
              领取
            </Button>
          </div>
        </div>

        <Divider style={{ color: '#f70d0dd9' }} />
        <div className="title">节点委托列表</div>
        <div className="utable orderTable">
          <Table
            scroll={{ y: tbH }}
            dataSource={stakeList}
            columns={mergedStakeColumns}
            rowClassName="editable-row"
            rowKey={(columns) => columns.enclave_public_key}
            pagination={false}
            loading={stakeLoading}
          />
        </div>

        <Divider style={{ color: '#f70d0dd9' }} />
        <div className="title">
          文件列表
          <Button
            className="btn_ori"
            onClick={() => creadOrder()}
            type="primary"
            shape="round"
          >
            上传文件
          </Button>
        </div>
        <div className="utable orderTable">
          <Table
            scroll={{ y: tbH }}
            dataSource={fileList}
            columns={mergedColumns}
            rowClassName="editable-row"
            rowKey={(columns) => columns.cid}
            pagination={false}
            loading={fileLoading}
          />
        </div>
      </div>
      <div className="max-body upagination">
        <Pagination
          total={fileList.length}
          pageSize={10}
          onChange={() => getFileList()}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 页`}
        />
      </div>
    </div>
  );
}
export default connect((state: any) => {
  return {
    ...state['canter'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(canter);
