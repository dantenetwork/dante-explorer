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

function canter(props: any) {
  const [stakeList, setStakeList] = useState(originData);
  const [DATBalance, setDATBalance] = useState(0);
  const [fileList, setFileList] = useState(originData);

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
      console.log(data);
    } catch (error: any) {
      console.log(error);
      // message.error(error);
    }
  };

  const creadOrder = async () => {
    history.push('/order/post');
  };

  const getStakeList = async () => {
    const originData: Item[] = [];

    try {
      let data: any = await get(api.center.stakeList, {
        from: ethereum.selectedAddress,
        skip: 0,
      });
      setStakeList(data.list);
      console.log(data);
    } catch (error: any) {
      message.error(error);
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

  const stakeColumns: any[] = [
    {
      title: 'from',
      dataIndex: 'from',
      width: '30%',
      editable: true,
      align: 'center', // 设置文本居中的属性
      render: (from: any) => ({ from }),
    },
    {
      title: '节点名称',
      dataIndex: 'createdTime',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'createdTime',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '区块号',
      dataIndex: 'createdTime',
      width: '20%',
      editable: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'createdTime',
      width: '20%',
      editable: true,
      align: 'center',
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
            <div className={styles.txt_item_val}>104.89 DAT</div>
            <Button className="btn_ori" type="primary" shape="round">
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
            rowKey={(columns) => columns.cid}
            pagination={false}
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
