import React, { useState, useEffect } from 'react';
import styles from './node.less';
// import './node.css'
import { Table, message, Pagination } from 'antd';
import { Link, connect, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';

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
}

const originData: Item[] = [];

function node(props: any) {
  const [dataList, setDataList] = useState(originData);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [tbH, setTbH] = useState(600);
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

  const entrust = async () => {};
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

  const columns: any[] = [
    {
      title: '节点ID(enclave key）',
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
      title: '总容量',
      dataIndex: 'totalCapacity',
      width: '20%',
      align: 'center',
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
    },
    {
      title: '委托收益比例',
      dataIndex: 'entrustedIncome',
      width: '20%',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'key',
      width: '20%',
      align: 'center',
      fixed: 'right',
      render: () => <a onClick={(row) => entrust()}>委托</a>,
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
}
export default connect((state: any) => {
  return {
    ...state['storage'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(node);
