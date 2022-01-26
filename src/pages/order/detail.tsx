import React, { useState, useEffect } from 'react';
import styles from './detail.less';
import { Table, message, Pagination, Divider, Button } from 'antd';
import { Link, connect, history, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
const { utils, BigNumber } = require('ethers');
const ethereum = window.ethereum;

interface ItemValue {
  name: string;
  value: Number;
}
const DataItemValue: ItemValue[] = [];

interface nodeItem {
  name: string;
  id: string;
}
const nodeListData: nodeItem[] = [];
const detail = (props: any) => {
  const [publicKey, setPublicKey] = useState(props.match.params?.id || '');
  const [detail, setDetail] = useState(DataItemValue);
  const [dataList, setDataList] = useState(nodeListData);
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
    // getList();
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

  const init = async () => {
    try {
      const data: any = await get(api.order.deal + '/' + publicKey);
      let dealInfo = [];
      if (data) {
        const ret = data;
        const nameArray = [
          '订单 ID',
          '订单状态',
          '节点是否被罚没',
          '订单文件大小',
          '订单价格',
          '订单周期',
          '订单结束区块号',
          '订单发起人',
          '需要存储节点的数量',
          '订单总奖励',
          '订单剩余奖励',
          '节点列表',
        ];

        for (let i = 0; i < ret.length; i++) {
          let value = ret[i];
          if (i == 1) {
            value = value;
          } else if (i == 2) {
            value = value;
          } else if (i == 3) {
            value = Number(value / 1024 / 1024 / 1024) + ' GB';
          } else if (i == 4) {
            value = utils.formatUnits(value || '0', 18) + ' DAT';
          } else if (i == 5) {
            value = value;
          } else if (i == 9 || i == 10) {
            value = utils.formatUnits(value || '0', 18) + ' DAT';
          } else {
            value = value;
          }
          dealInfo.push({
            name: nameArray[i],
            value: value,
          });
        }
      }
      setDetail(dealInfo);
      const newArrray = Array.isArray(dealInfo[11]?.value)
        ? dealInfo[11].value
        : [];
      setDataList(newArrray);
    } catch (error: any) {
      message.error(error);
    }
  };

  const columns: any[] = [
    {
      title: '节点ID(enclave key）',
      dataIndex: 'id',
      width: '30%',
      align: 'center', // 设置文本居中的属性
      render: (id: any) => ({ id }),
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      width: '20%',
      align: 'center',
    },
  ];
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record: nodeItem) => ({
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
          订单详情: <span className={styles.title_val}>{publicKey}</span>
        </div>

        <div className="space"></div>

        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>发起人：</div>
            <div className={styles.txt_item_val}>{detail[7]?.value}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>状态：</div>
            <div className={styles.txt_item_val}>
              {
                ['等待接单', '已接满', '已到期', '非法订单'][
                  Number(detail[1]?.value)
                ]
              }
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>大小：</div>
            <div className={styles.txt_item_val}>{detail[3]?.value}</div>
          </div>
        </div>
        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>价格：</div>
            <div className={styles.txt_item_val}>{detail[4]?.value} DAT</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>区块号：</div>
            <div className={styles.txt_item_val}>{detail[6]?.value}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>区块数：</div>
            <div className={styles.txt_item_val}>{detail[5]?.value}</div>
          </div>
        </div>
        {/* <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>到期区块：</div>
            <div className={styles.txt_item_val}>{detail[7]?.value}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>预估时间：</div>
            <div className={styles.txt_item_val}>{detail[7]?.value}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>订单结束时间：</div>
            <div className={styles.txt_item_val}>{detail[7]?.value}</div>
          </div>
        </div> */}
        <div className={styles.txt_row}>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>罚没：</div>
            <div className={styles.txt_item_val}>
              {['未被罚没', '已被罚没'][Number(detail[2]?.value)]}
            </div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>奖励总额：</div>
            <div className={styles.txt_item_val}>{detail[9]?.value}</div>
          </div>
          <div className={styles.txt_item}>
            <div className={styles.txt_item_title}>奖励余额：</div>
            <div className={styles.txt_item_val}>{detail[10]?.value}</div>
          </div>
        </div>

        <div className="space"></div>

        <Divider style={{ color: '#f70d0dd9', margin: '40px 0' }} />
        <div className="title">节点列表</div>
        <div className="utable orderTable">
          <Table
            scroll={{ y: tbH }}
            dataSource={dataList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            rowKey={(columns) => columns.id}
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
};
export default connect((state: any) => {
  return {
    ...state['storage'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(detail);
