import React, { useState, useEffect } from 'react';
import styles from './order.less';
// import './node.css'
import { Table, Modal, Form, Input, message, Pagination, Tooltip } from 'antd';
import { Link, connect, history, ConnectProps } from 'umi';
import { toSize } from '@/utils/utils';
import axios from 'axios';
import { get, post } from '@/utils/server';
import { formatDate } from '@/utils/utils';
import { api } from '@/config/apis';
import { config } from '@/config';
const ethereum = window.ethereum;
const { utils, BigNumber } = require('ethers');
interface Item {
  key: string;
  cid: string;
  size: string;
  createdTime: string;
  overTime: string;
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
  const [DATBalance, setDATBalance] = useState(0);
  const [selectRow, setSelectRow] = useState({
    key: '',
    cid: '',
    size: '',
    createdTime: '',
    overTime: '',
  });
  useEffect(() => {
    // 需要在 componentDidMount 執行的内容
    getList();
    ethereum &&
      ethereum.on('accountsChanged', function (accounts: any) {
        //订阅 钱包地址更换地址
        console.log('成功了 刷新吧1');
      });

    return () => {
      // 需要在 componentWillUnmount 執行的内容
    };
  }, []);
  useEffect(() => {
    //監聽屏幕
    getTbH();
    ethereum &&
      ethereum.on('accountsChanged', function (accounts: any) {
        //订阅 钱包地址更换地址
        console.log('成功了 刷新吧2');
      });
    return () => {};
  });
  const getTbH = async () => {
    const { navHeight, wHeight }: any = props;
    const ph: any = document.querySelector('.upagination')?.clientHeight || 0;
    const newTbH = wHeight - navHeight - ph - 240;
    if (tbH !== newTbH) {
      setTbH(newTbH);
    }
  };

  const getList = async () => {
    const originData: Item[] = [];
    try {
      if (!hasNext) return false;
      setLoading(true);
      let data: any = await get(api.order.deal, { skip: page });
      data.list.reverse();
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
      render: (val: number) => <span>{toSize(val)}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'startTime',
      width: '20%',
      editable: true,
      align: 'center',
      render: (val: string) => (
        <span>{formatDate(val, 'yyyy-MM-dd hh:mm:ss') || '-'}</span>
      ),
    },
    {
      title: '有效期至',
      dataIndex: 'endTime',
      width: '20%',
      editable: true,
      align: 'center',
      render: (val: string) => (
        <span>{formatDate(val, 'yyyy-MM-dd hh:mm:ss') || '-'}</span>
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
            rowKey={(columns) => columns.cid}
          />
        </div>
      </div>
      {/* <div className="max-body upagination">
        <Pagination
          total={total}
          pageSize={10}
          onChange={() => getList()}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 页`}
        />
      </div> */}
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
