import React, { useState, useEffect } from 'react';
import styles from './node.less';
// import './node.css'
import { Table, Modal, Form, Input, message, Pagination, Tooltip } from 'antd';
import { Link, connect, history, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
import { config } from '@/config';
const ethereum = window.ethereum;
const MODELS_NAME = namespace_shop;
console.log(namespace_shop);

interface Item {
  key: string;
  totalCapacity: Number;
  taskVolume: string;
  Delegator: Number;
  joinTime: string;
  totalPledge: string;
  entrustedIncome: Number;
  latAddress: string; //将enclave公钥转换为lat格式的地址
  rewardAddress: string; //接收奖励的矿工地址
  senderAddress: string; //发送事务的矿工地址
  senderAddressHex: string;
}

const originData: Item[] = [];

function node(props: any) {
  const [form] = Form.useForm();
  const [dataList, setDataList] = useState(originData);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [tbH, setTbH] = useState(600);
  const [loading, setLoading] = useState(true);
  const [tradeModel, setTradeModel] = useState(false);
  const [DATBalance, setDATBalance] = useState(0);
  const [selectRow, setSelectRow] = useState({
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
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    getList();
    return () => {
      // 需要在 componentWillUnmount 執行的内容
    };
  }, []);
  useEffect(() => {
    //監聽屏幕
    getTbH();
    return () => {};
  });
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
    setLoading(true);
    try {
      if (!hasNext) return false;
      let data: any = await get(api.storage.list, { skip: page });
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
      setLoading(false);
    } catch (error: any) {
      message.error(error);
      setLoading(false);
    }
    // setDataList(originData);
  };

  const refreshBalance = async () => {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [ethereum.selectedAddress, 'latest'],
      id: 1,
    });
    setDATBalance(parseInt(balance) / config.UNIT);
  };
  const entrust = async (key: string, row: any) => {
    setSelectRow(row);
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
        setTradeModel(false);
      })
      .catch((errorInfo) => {});
  };

  const hideModal = () => {
    setTradeModel(false);
  };

  const entrusting = async (count: Number) => {
    const selectedAddressHex = props.accountAddress;
    const contractAddressHex = selectRow?.senderAddressHex;

    const data = await get(api.storage.convertHexadecimal, {
      contractAddress: selectRow?.senderAddress,
      rewardAddress: selectRow?.rewardAddress,
      amount: count, //数量
    });

    console.log(data);

    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
      gas: '0xF4240', // customizable by user during MetaMask confirmation.
      to: contractAddressHex, // Required except during contract publications.
      from: selectedAddressHex, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: data, // Optional, but used for defining smart contract creation and interaction.
      chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    console.log(transactionParameters);

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    console.log(txHash);
  };

  const columns: any[] = [
    {
      title: '节点ID(enclave key）',
      dataIndex: 'key',
      width: '30%',
      align: 'center', // 设置文本居中的属性
      render: (key: any) => (
        <Link to={`/storage/detail?key=${key}`} className="link">
          <Tooltip placement="bottom" title={key}>
            <span>
              {key.slice(0, 10) +
                '...' +
                key.slice(key.toString().length - 10, key.toString().length)}
            </span>
          </Tooltip>
        </Link>
      ),
    },
    {
      title: '总容量',
      dataIndex: 'totalCapacity',
      width: '20%',
      align: 'center',
      render: (val: any) => <span>{val || 0} GB</span>,
    },
    {
      title: '任务量',
      dataIndex: 'taskVolume',
      width: '20%',
      align: 'center',
    },
    {
      title: '委托者',
      dataIndex: 'Delegator',
      width: '20%',
      align: 'center',
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
      width: '20%',
      align: 'center',
    },
    {
      title: '总质押',
      dataIndex: 'totalPledge',
      width: '20%',
      align: 'center',
      render: (val: any) => <span>{val || 0} DAT</span>,
    },
    {
      title: '委托收益比例',
      dataIndex: 'entrustedIncome',
      width: '20%',
      align: 'center',
      render: (val: any) => <span>{val || 0}%</span>,
    },
    {
      title: '操作',
      dataIndex: 'key',
      width: '20%',
      align: 'center',
      fixed: 'right',
      render: (key: string, row: object) => (
        <a onClick={() => entrust(key, row)}>委托</a>
      ),
    },
  ];
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
      <div className={`max-body contain`}>
        <div className="title">订单列表</div>
        <div className="utable orderTable">
          <Table
            scroll={{ y: tbH }}
            dataSource={dataList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            loading={loading}
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
}
export default connect((state: any) => {
  return {
    ...state['storage'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(node);
