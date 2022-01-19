import React, { useState, useEffect } from 'react';
import styles from './detail.less';
import { Table, message, Pagination, Divider, Button } from 'antd';
import { Link, connect, history, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
const ethereum = window.ethereum;

interface Item {
  key: string;
  totalCapacity: Number;
  taskVolume: string;
  Delegator: Number;
  joinTime: string;
  totalPledge: string;
  entrustedIncome: Number;
}

const originData: Item[] = [];

const detail = (props: any) => {
  const [publicKey, setPublicKey] = useState(props.location.query?.key || '');
  const [detail, setDetail] = useState({
    key: '',
    totalCapacity: 0,
    taskVolume: '',
    latAddress: '',
    Delegator: 0,
    joinTime: '',
    totalPledge: '',
    entrustedIncome: 0,
  });
  const [dataList, setDataList] = useState(originData);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [tbH, setTbH] = useState(400);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    // setPublicKey(props.location.query?.key||'')
    console.log(window.navigator.userAgent.toLowerCase());
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
    console.log(props.accountAddress);
    if (!props.accountAddress) {
      history.push('/login');
    } else {
      const selectedAddressHex = props.accountAddress;
      const contractAddressHex = detail?.latAddress;
      const data = {
        enclave_public_key: detail.key,
        amount: 0,
      };
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
        gas: '0xF4240', // customizable by user during MetaMask confirmation.
        to: contractAddressHex, // Required except during contract publications.
        from: selectedAddressHex, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data: detail.key, // Optional, but used for defining smart contract creation and interaction.
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
    }
  };

  const columns: any[] = [
    {
      title: '订单ID',
      dataIndex: 'key',
      width: '30%',
      align: 'center', // 设置文本居中的属性
      render: (key: any) => (
        <Link to={`/storage/detail?key=${key}`} className="link">
          {key}
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
          节点ID: <span className={styles.title_val}>{publicKey}</span>
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
            <div className={styles.txt_item_title}>委托数量：</div>
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
            <div className={styles.txt_item_title}>未领取的节点奖励：</div>
            <div className={styles.txt_item_val}>18.23 DAT</div>
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
            <div className={styles.txt_item_title}>未领取的总委托奖励：</div>
            <div className={styles.txt_item_val}>18.23 DAT</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>预估委托年化收益：</div>
            <div className={styles.txt_item_val}>67.56%</div>
          </div>
          <div className={styles.txt_item}></div>
        </div>

        <Divider style={{ color: '#f70d0dd9', margin: '40px 0' }} />
        <div className="title">节点列表</div>
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
