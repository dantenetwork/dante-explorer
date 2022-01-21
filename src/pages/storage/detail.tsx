import React, { useState, useEffect } from 'react';
import styles from './detail.less';
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Pagination,
  Divider,
  Button,
  Tooltip,
} from 'antd';
import { Link, connect, history, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
import { config } from '@/config';
const ethereum = window.ethereum;
// var Web3 = require("web3");
// let web3 = new Web3(new Web3.providers.HttpProvider(testNetwork));

interface Item {
  key: string;
  totalCapacity: Number;
  taskVolume: string;
  latAddress: string; //将enclave公钥转换为lat格式的地址
  rewardAddress: string; //接收奖励的矿工地址
  senderAddress: string; //发送事务的矿工地址
  senderAddressHex: string;
  Delegator: Number;
  joinTime: string;
  totalPledge: string;
  entrustedIncome: Number;
  total_miner_reward: Number;
  total_staker_reward: Number;
}

const originData: Item[] = [];

const detail = (props: any) => {
  const [form] = Form.useForm();
  const [publicKey, setPublicKey] = useState(props.location.query?.key || '');
  const [detail, setDetail] = useState({
    key: '',
    totalCapacity: 0,
    taskVolume: '',
    Delegator: 0,
    joinTime: '',
    latAddress: '', //将enclave公钥转换为lat格式的地址
    rewardAddress: '', //接收奖励的矿工地址
    senderAddress: '', //发送事务的矿工地址
    senderAddressHex: '',
    totalPledge: '',
    entrustedIncome: 0,
    total_miner_reward: 0,
    total_staker_reward: 0,
  });
  const [DATBalance, setDATBalance] = useState(0);
  const [dataList, setDataList] = useState(originData);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [tbH, setTbH] = useState(400);
  const [loading, setLoading] = useState(true);
  const [tradeModel, setTradeModel] = useState(false);
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    // setPublicKey(props.location.query?.key||'')

    init();
    getList();
    return () => {
      // 需要在 componentWillUnmount 執行的内容
    };
  }, []);
  useEffect(() => {
    //監聽屏幕
    // getTbH();
    return () => {};
  });

  const refreshBalance = async () => {
    const balance = await get(api.balance, {
      selectedAddress: ethereum.selectedAddress,
    });

    // const balance = await ethereum.request({
    //   method: 'eth_getBalance',
    //   params: [ethereum.selectedAddress, 'latest'],
    //   id: 1,
    // });
    setDATBalance(Number(balance) / config.UNIT);
  };

  const getTbH = async () => {
    const { navHeight, wHeight }: any = props;
    const ph: any = document.querySelector('.upagination')?.clientHeight || 0;
    const newTbH = wHeight - navHeight - ph - 240;
    console.log(wHeight, navHeight, ph);
    if (tbH !== newTbH) {
      setTbH(newTbH);
    }
  };

  const getList = async () => {
    const originData: Item[] = [];
    try {
      if (!hasNext) return false;
      let data: any = await get(api.storage.minerlist, {
        enclave_public_key: publicKey,
      });
      setDataList(data.list);
      setTotal(data.total);
      if (data.total - page * 10 > 10) {
        setPage(page + 1);
        setHasNext(true);
      } else {
        setHasNext(false);
      }
      // setDataList((oldData)=>({
      //   ...data.list
      // }))
    } catch (error: any) {
      message.error(error);
    }
    // setDataList(originData);
  };

  const init = async () => {
    try {
      console.log(publicKey);
      let data: any = await get(api.storage.detail, {
        enclave_public_key: publicKey,
      });
      setDetail(data);
      console.log(data);
    } catch (error: any) {
      message.error(error);
    }
  };

  const entrust = async () => {
    if (!props.accountAddress) {
      history.push('/login');
    } else {
      await refreshBalance();
      await setTradeModel(true);
    }
  };

  const comfirmTrade = () => {
    //校验数量
    form
      .validateFields()
      .then((values) => {
        entrusting(values.count);
        hideModal();
      })
      .catch((errorInfo) => {});
  };

  const hideModal = () => {
    setTradeModel(false);
    form.resetFields();
  };

  const entrusting = async (count: Number) => {
    const newConfig: any = await get('/config');
    console.log('666666666', newConfig);
    const selectedAddressHex = props.accountAddress;
    // const contractAddressHex = detail?.senderAddressHex;

    const tokenContractAddressHex = newConfig.tokenContractAddressHex;
    // '0xaab2110f01c41b9fb05b6472fa6c5c1c8f259abb';

    const verifyContractAddressHex = newConfig.verifyContractAddressHex;
    // '0x82e8570169703a6eacbb7e7f619b6bb1059608fb';

    const tokenApproveData = await get(api.storage.encodeTokenApprove, {
      amount: Number(count),
    });
    // '0xe8883814b7fd4428590c9482e8570169703a6eacbb7e7f619b6bb1059608fb89056bc75e2d63100000';
    // '0xdf883814b7fd4428590c9482e8570169703a6eacbb7e7f619b6bb1059608fb02
    console.log(tokenApproveData);
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

    // const data = await get(api.storage.convertHexadecimal, {
    //   contractAddress: detail?.senderAddress,
    //   rewardAddress: detail?.rewardAddress,
    //   amount: count, //数量
    // });
    const stakeTokenData = await get(api.storage.encodeStakeToken, {
      enclave_public_key: publicKey,
      amount: Number(count),
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

    // send approve transaction
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const approveTxHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [approveTokenParameters],
    });
    console.log(approveTxHash);

    // send stake token transaction

    setTimeout(async function () {
      const stakeTxHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [stakeTokenParameters],
      });
      console.log(stakeTxHash);
    }, 2000);
  };

  const columns: any[] = [
    {
      title: '订单ID',
      dataIndex: 'key',
      width: '30%',
      align: 'center', // 设置文本居中的属性
      render: (key: any) => (
        <Link to={`/storage/detail?key=${key}`} className="link">
          <Tooltip placement="bottom" title={key}>
            <span>
              {key.slice(0, 15) +
                '...' +
                key.slice(key.toString().length - 15, key.toString().length)}
            </span>
          </Tooltip>
        </Link>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'totalCapacity',
      width: '20%',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'joinTime',
      width: '20%',
      align: 'center',
      render: (val: string) => <span>{val || '-'}</span>,
    },
    {
      title: '有效期至',
      dataIndex: 'totalPledge',
      width: '20%',
      align: 'center',
      render: (val: string) => <span>{val || '-'}</span>,
    },
  ];
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        // dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });
  return (
    <div className={styles.order}>
      <div className={`max-body contain ${styles.contain}`}>
        <div className="space"></div>

        <div className={styles.title}>
          节点ID:
          <Tooltip placement="bottom" title={publicKey}>
            <span className={styles.title_val}>
              {publicKey.slice(0, 15) +
                '...' +
                publicKey.slice(
                  publicKey.toString().length - 15,
                  publicKey.toString().length,
                )}
            </span>
          </Tooltip>
          <Button
            className="btn_ori"
            type="primary"
            shape="round"
            onClick={() => entrust()}
          >
            委托
          </Button>
        </div>

        <div className="space"></div>

        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>总容量：</div>
            <div className={styles.txt_item_val}>{detail.totalCapacity} GB</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>委托者数量:</div>
            <div className={styles.txt_item_val}>{detail.Delegator}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>总质押：</div>
            <div className={styles.txt_item_val}>{detail.totalPledge} DAT</div>
          </div>
        </div>
        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>委托收益比例：</div>
            <div className={styles.txt_item_val}>
              {detail.entrustedIncome} %
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>任务量：</div>
            <div className={styles.txt_item_val}>{detail.taskVolume}</div>
          </div>
          <div className={styles.txt_item}></div>
        </div>

        <div className="space"></div>

        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>节点奖励：</div>
            <div className={styles.txt_item_val}>
              {detail.total_miner_reward || '0'} DAT
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>预估节点年化收益：</div>
            <div className={styles.txt_item_val}>53.84%</div>
          </div>
          <div className={styles.txt_item}>
            {/* <div className={styles.txt_item_title}></div>
            <div className={styles.txt_item_val}></div> */}
          </div>
        </div>
        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>委托奖励：</div>
            <div className={styles.txt_item_val}>
              {detail.total_staker_reward || '0'} DAT
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>预估委托年化收益：</div>
            <div className={styles.txt_item_val}>67.56%</div>
          </div>
          <div className={styles.txt_item}></div>
        </div>

        <Divider style={{ color: '#f70d0dd9', margin: '40px 0' }} />
        <div className="title">存储订单列表</div>
        <div className="utable orderTable">
          <Table
            scroll={{ y: tbH }}
            dataSource={dataList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
          />
        </div>
      </div>
      <div className="max-body upagination">
        <Pagination
          total={total}
          pageSize={10}
          onChange={() => getList()}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 页`}
        />
      </div>
      <Modal
        title={`余额：${DATBalance}`}
        visible={tradeModel}
        onOk={comfirmTrade}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
      >
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="委托数量"
            name="count"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value) {
                    if (value > DATBalance) {
                      return Promise.reject(
                        new Error('委托数量不能超过账户余额!'),
                      );
                    } else {
                      return Promise.resolve();
                    }
                  } else {
                    return Promise.reject(new Error('请输入委托数量!'));
                  }
                },
              }),
            ]}
          >
            <Input placeholder="请输入委托数量" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect((state: any) => {
  return {
    ...state['storage'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(detail);
