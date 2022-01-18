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

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function canter(props: any) {
  const [dataList, setDataList] = useState(originData);
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

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const onReset = () => {
    formRef.current!.resetFields();
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
            name="upload"
            label="文件"
            className="items"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传文件!' }]}
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />} className="btn_ori">
                上传文件
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="radio-button"
            label="选择策略"
            className="items"
            rules={[{ required: true, message: '请选择策略!' }]}
          >
            <Radio.Group>
              <Radio value="a">隐藏</Radio>
              <Radio value="b">公开</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="radio-button"
            label="加密存储"
            className="items"
            rules={[{ required: true, message: '请选择加密存储!' }]}
          >
            <Radio.Group>
              <Radio value="a">是</Radio>
              <Radio value="b">否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="radio-button"
            label="选择公链"
            className="items"
            rules={[{ required: true, message: '请选择公链!' }]}
          >
            <Radio.Group>
              <Radio value="a">PlatON</Radio>
              <Radio value="b">NEAR</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="总价"
            name="input-number"
            rules={[{ required: true, message: '请输入总价!' }]}
            className="items"
          >
            <InputNumber
              min={0}
              max={99999999999}
              placeholder="请输入总价"
              className="input"
            />
            <span className="ant-form-text"> DAT</span>
          </Form.Item>

          <Form.Item
            label="订单周期"
            name="input-number"
            className="items"
            rules={[{ required: true, message: '请输入>0的整数!' }]}
          >
            <InputNumber
              min={1}
              max={99999999999}
              placeholder="请输入订单周期"
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
