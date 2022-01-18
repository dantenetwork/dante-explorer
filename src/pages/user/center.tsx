import React, { useState, useEffect } from 'react';
import styles from './center.less';
// import './node.css'
import { Table, Button, Divider, message, Pagination } from 'antd';
import { Link, connect, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';

const MODELS_NAME = namespace_shop;
console.log(namespace_shop);

interface Item {
  key: string;
  id: string;
  size: string;
  createdTime: string;
  overTime: string;
}

const originData: Item[] = [];

function canter(props: any) {
  const [dataList, setDataList] = useState(originData);
  const [tbH, setTbH] = useState(600);
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    getList();
    return () => {
      // 需要在 componentWillUnmount 執行的内容
    };
  }, []);
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

  const getList = async () => {
    const originData: Item[] = [];
    try {
      // let data:any = await get(api.storage.list)
      // console.log(data)
      // setDataList((oldData)=>({
      //   ...oldData,
      //   cur_period_total_capacity:Number((data?.globalInfo[9] / 1024) * 1024 * 1024),
      //   nodes_number:data.minerCount
      // }))
    } catch (error: any) {
      message.error(error);
    }
    console.log(originData);
    for (let i = 0; i < 50; i++) {
      originData.push({
        key: i.toString(),
        id: 'oxf88ce5fd607d7a27f21c3d06d3dwefwf7383249912' + i,
        size: '3.2GB',
        createdTime: '2021-12-28  12:23:55',
        overTime: '2021-12-28  12:23:55',
      });
    }
    setDataList(originData);
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

  const columns: any[] = [
    {
      title: '订单ID',
      dataIndex: 'id',
      width: '30%',
      editable: true,
      align: 'center', // 设置文本居中的属性
      render: (id: any) => (
        <Link to={`/node/detail?id=${id}`} className="link">
          {id}
        </Link>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: '20%',
      editable: true,
      align: 'center',
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
        // dataIndex: col.dataIndex,
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
            <div className={`${styles.txt_item_title} ${styles.me}`}>
              PlatON
            </div>
            <div className={`${styles.txt_item_val} ${styles.me}`}>
              104.89 DAT
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={`${styles.txt_item_title} ${styles.me}`}>NEAR</div>
            <div className={`${styles.txt_item_val} ${styles.me}`}>
              104.89 DAT
            </div>
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
            <div className={styles.txt_item_val}>104.89 DAT</div>
            <Button className="btn_ori" type="primary" shape="round">
              领取
            </Button>
          </div>
        </div>
        <Divider style={{ color: '#f70d0dd9' }} />

        <Divider style={{ color: '#f70d0dd9' }} />
        <div className="title">
          文件列表
          <Button className="btn_ori" type="primary" shape="round">
            上传文件
          </Button>
        </div>
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
          total={dataList.length}
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
    ...state['canter'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(canter);
