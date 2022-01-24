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
import { history, connect, ConnectProps } from 'umi';

import axios from 'axios';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const ethereum = window.ethereum;

interface Item {
  key: string;
  id: string;
  size: string;
  createdTime: string;
  overTime: string;
}
interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
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
  const [loading, setLoading] = useState(false);
  const [orderQuery, setOrderQuery] = useState({
    cid: '', //deal cid of IPFS network
    size: 0, //deal files size
    deal_price: 0, //deal price
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
    setLoading(true);
    if (values.public_chain === '1') {
      message.success('订单创建成功', () => {
        cancel();
      });
    } else {
      const newConfig: any = await get('/config');
      const selectedAddressHex = ethereum?.selectedAddress;

      const tokenContractAddressHex = newConfig.tokenContractAddressHex;
      // '0xaab2110f01c41b9fb05b6472fa6c5c1c8f259abb';

      const tokenApproveData = await get(api.storage.encodeTokenApprove, {
        amount: Number(values.deal_price),
      });
      // '0xdf883814b7fd4428590c9482e8570169703a6eacbb7e7f619b6bb1059608fb02

      console.log(`tokenApproveData: ${tokenApproveData}`);
      // return false
      const approveTokenParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
        gas: '0xF4240', // customizable by user during MetaMask confirmation.
        to: tokenContractAddressHex, // Required except during contract publications.
        from: selectedAddressHex, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data: tokenApproveData, // Optional, but used for defining smart contract creation and interaction.
        chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      console.log(`approveTokenParameters:${approveTokenParameters}`);

      // send approve transaction
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const approveTxHash = await ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [approveTokenParameters],
        })
        .catch((err: any) => {
          console.error(err);
        });
      console.log(`approveTxHash：${approveTxHash}`);

      let stakeTokenData = await get(api.order.addDeal, {
        cid: orderQuery.cid,
        size: Number(orderQuery.size),
        deal_price: Number(values.deal_price),
        duration: Number(values.duration),
        miner_required: Number(values.miner_required),
      }).catch((err: any) => {
        console.error(err);
      });

      const marketContractAddressHex = newConfig.marketContractAddressHex;
      // '0x82e8570169703a6eacbb7e7f619b6bb1059608fb';

      console.log('stakeTokenData：', stakeTokenData);
      const stakeTokenParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: '0x4A817C800', // customizable by user during MetaMask confirmation.
        gas: '0xF4240', // customizable by user during MetaMask confirmation.
        to: marketContractAddressHex, // Required except during contract publications.
        from: selectedAddressHex, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data: stakeTokenData, // Optional, but used for defining smart contract creation and interaction.
        chainId: '210309', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      console.log(stakeTokenParameters);

      // send stake token transaction

      setTimeout(async function () {
        const stakeTxHash = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [stakeTokenParameters],
        });
        console.log(stakeTxHash);
        if (stakeTxHash) {
          message.success('订单创建成功', () => {
            cancel();
          });
        }
      }, 1500);
      await setLoading(false);
    }
  };

  const cancel = async () => {
    history.goBack();
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

          <Form.Item
            label="订单周期"
            name="duration"
            className="items"
            rules={[{ required: true, message: '请输入区块数量!' }]}
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

          <Form.Item label="总价" className="items required">
            <Form.Item
              name="deal_price"
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
          <Form.Item wrapperCol={{ span: 15, offset: 5 }} className="btn">
            <Button
              type="primary"
              className="btn_ori btn_ori_submit"
              shape="round"
              htmlType="submit"
              loading={loading}
            >
              提交
            </Button>
            <Button
              type="default"
              onClick={cancel}
              className="btn_ori_cancel"
              shape="round"
            >
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
