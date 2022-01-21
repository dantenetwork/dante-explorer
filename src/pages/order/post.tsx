import React, { useState, useEffect } from 'react';
import styles from './post.less';
import './post.css';
import {
  Button,
  Divider,
  message,
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import { Link, connect, ConnectProps, namespace_shop } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

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

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 3, offset: 1 },
  wrapperCol: { span: 17 },
};
const formItemLayoutItem = {
  labelCol: { span: 3, offset: 1 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function canter(props: any) {
  const [dataList, setDataList] = useState(originData);
  const [orderQuery, setOrderQuery] = useState({
    cid: '', //deal cid of IPFS network
    size: 0, //deal files size
    price: 0, //deal price per block
    duration: 0, //deal duration (blocks)
    miner_required: 0, //number of miners required
  });
  const [tbH, setTbH] = useState(600);
  const formRef = React.createRef<FormInstance>();
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

  const goUploadFile = async (val: any) => {
    var formData = new FormData();
    formData.append('file', val.file);
    let data: any = await get(api.common.uploadFile, { file: formData });
    setOrderQuery((oldData) => ({
      ...oldData,
      ...data,
    }));
  };

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values, orderQuery);
    if (values.public_chain === '1') {
      message.success('success');
    } else {
      let data = await get(api.order.addDeal, {
        cid: orderQuery.cid,
        size: Number(orderQuery.size),
        price: Number(values.price),
        duration: Number(values.duration),
        miner_required: Number(values.miner_required),
      });
      console.log(data);
    }
  };

  return (
    <div className={styles.order}>
      <div className={`max-body contain postForm ${styles.contain}`}>
        <Form
          ref={formRef}
          name="validate_other"
          {...formItemLayout}
          onFinish={onFinish}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
        >
          <Form.Item label="上传文件" className="title"></Form.Item>

          <Form.Item
            name="cid"
            label="文件"
            className="items"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传文件!' }]}
          >
            <Upload
              name="logo"
              customRequest={(val) => goUploadFile(val)}
              listType="picture"
              maxCount={1}
              itemRender={(originNode, file: any, currFileList) => {
                return (
                  <div className={styles.fileHit}>
                    <div className={styles.txt}>
                      CID：oxfodok24235365646557vjfv...j99hff
                    </div>
                    <div className={styles.txt}>
                      文件大小：
                      {file.size > 1024 && file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(4)} KB`
                        : file.size >= 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(4)} MB`
                        : `${file.size.toFixed(4)} B`}
                    </div>
                  </div>
                );
              }}
            >
              <Button icon={<UploadOutlined />} className="btn_ori">
                上传文件
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="tactics"
            label="选择策略"
            className="items"
            rules={[{ required: true, message: '请选择策略!' }]}
          >
            <Radio.Group>
              <Radio value="0">隐藏</Radio>
              <Radio value="1">公开</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="encrypted_storage"
            label="加密存储"
            className="items"
            rules={[{ required: true, message: '请选择加密存储!' }]}
          >
            <Radio.Group>
              <Radio value="0">是</Radio>
              <Radio value="1">否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="public_chain"
            label="选择公链"
            className="items"
            rules={[{ required: true, message: '请选择公链!' }]}
          >
            <Radio.Group>
              <Radio value="0">PlatON</Radio>
              <Radio value="1">NEAR</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="存储节点数量"
            name="miner_required"
            rules={[{ required: true, message: '请输入存储节点数量!' }]}
            className="items"
          >
            <InputNumber
              parser={(value) => {
                if (typeof value === 'string') {
                  return !isNaN(Number(value))
                    ? value.replace(/[^0-9]/g, '')
                    : 0;
                } else if (typeof value === 'number') {
                  return !isNaN(value)
                    ? String(value).replace(/[^0-9]/g, '')
                    : 0;
                } else {
                  return 0;
                }
              }}
              placeholder="请输入存储节点数量"
              className="input"
            />
          </Form.Item>

          <Form.Item label="总价" className="items required">
            <Form.Item
              name="price"
              rules={[{ required: true, message: '请输入总价!' }]}
              noStyle
            >
              <InputNumber
                min={0}
                max={99999999999}
                placeholder="请输入总价"
                className="input"
              />
            </Form.Item>
            <span className="ant-form-text"> DAT</span>
          </Form.Item>

          <Form.Item
            label="区块数量"
            name="duration"
            className="items"
            rules={[{ required: true, message: '请输入>0的整数!' }]}
          >
            <InputNumber
              parser={(value) => {
                if (typeof value === 'string') {
                  return !isNaN(Number(value))
                    ? value.replace(/[^0-9]/g, '')
                    : 0;
                } else if (typeof value === 'number') {
                  return !isNaN(value)
                    ? String(value).replace(/[^0-9]/g, '')
                    : 0;
                } else {
                  return 0;
                }
              }}
              placeholder="请输入区块数量"
              className="input"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 15, offset: 5 }} className="btn">
            <Button
              type="primary"
              className="btn_ori btn_ori_submit"
              shape="round"
              htmlType="submit"
            >
              提交
            </Button>
            <Button type="default" className="btn_ori_cancel" shape="round">
              取消
            </Button>
          </Form.Item>
        </Form>
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
