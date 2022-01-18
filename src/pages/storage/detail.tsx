import React, { Component, useState } from 'react';
import styles from './detail.less';
import {
  Table,
  Input,
  InputNumber,
  Divider,
  Form,
  Typography,
  Button,
} from 'antd';
import { Link, connect, ConnectProps, namespace_shop } from 'umi';

const MODELS_NAME = namespace_shop;

import { Pagination } from 'antd';

interface Item {
  key: string;
  id: string;
  size: string;
  createdTime: string;
  overTime: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

type EditableTableProps = Parameters<typeof Table>[0];

type propType = {
  name: string;
  number: number;
};
type EditableTableState = {
  dataList: Array<Item>;
  tbH: number;
};

class center extends Component<EditableTableProps, EditableTableState> {
  constructor(props: EditableTableProps) {
    super(props);

    this.state = {
      dataList: [],
      tbH: 600, //table高度
    };
    this.getTbH.bind(this);
    this.getList.bind(this);
  }
  componentDidMount() {
    this.getList();
  }
  componentDidUpdate() {
    this.getTbH();
  }
  async getTbH(): Promise<void> {
    const { navHeight, wHeight }: any = this.props;
    const ph: any = document.querySelector('.upagination')?.clientHeight || 0;
    const tbH = wHeight - navHeight - ph - 240;
    console.log(wHeight, navHeight, ph);
    if (this.state.tbH !== tbH) {
      this.setState({ tbH: tbH });
      console.log('哈哈');
    }
  }

  getList = () => {
    const originData: Item[] = [];
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
    this.setState({
      dataList: originData,
    });
  };
  render() {
    const { dataList, tbH } = this.state;

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
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>发起人：</div>
              <div className={styles.txt_item_val}>
                lat249hsdfsdf38223423454854273ncndsg
              </div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>状态</div>
              <div className={styles.txt_item_val}>关闭</div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>大小</div>
              <div className={styles.txt_item_val}>50KB</div>
            </div>
          </div>
          <div className={styles.txt_row}>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>发起人：</div>
              <div className={styles.txt_item_val}>
                lat249hsdfsdf38223423454854273ncndsg
              </div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>状态</div>
              <div className={styles.txt_item_val}>关闭</div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>大小</div>
              <div className={styles.txt_item_val}>50KB</div>
            </div>
          </div>
          <div className={styles.txt_row}>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>发起人：</div>
              <div className={styles.txt_item_val}>
                lat249hsdfsdf38223423454854273ncndsg
              </div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>状态</div>
              <div className={styles.txt_item_val}>关闭</div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>大小</div>
              <div className={styles.txt_item_val}>50KB</div>
            </div>
          </div>
          <div className={styles.txt_row}>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>发起人：</div>
              <div className={styles.txt_item_val}>
                lat249hsdfsdf38223423454854273ncndsg
              </div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>状态</div>
              <div className={styles.txt_item_val}>关闭</div>
            </div>
            <div className={styles.txt_item}>
              <div className={styles.txt_item_title}>大小</div>
              <div className={styles.txt_item_val}>50KB</div>
            </div>
          </div>

          <Divider style={{ color: '#f70d0dd9' }} />
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
            total={dataList.length}
            pageSize={10}
            onChange={() => this.getList()}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 页`}
          />
        </div>
      </div>
    );
  }
}
export default connect((state: any) => {
  return {
    ...state[MODELS_NAME],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(center);
