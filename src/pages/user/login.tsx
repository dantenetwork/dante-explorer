import React, { Component } from 'react';
import { connect, history } from 'umi';
import PropTypes from 'prop-types';
import styles from './login.less';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

interface state {
  DATContract: any;
  status: Boolean;
  connected: string;
  DATBalance: 0;

  selectedAddress: string;
}

// init DAT contract
const ethereum = window.ethereum;
// const testNetwork = "http://35.247.155.162:6789";
// var Web3 = require("web3");
// let web3 = new Web3(new Web3.providers.HttpProvider(testNetwork));
// const contractAddress = "lat142epzrcpcsdelvzmv3e05mzurj8jtx4mutqpw3";
// const contractAddressHex = web3.utils.decodeBech32Address(
//   contractAddress,
//   "lat"
// );
// console.log(contractAddressHex);
// const abi =
//   '[{"constant":true,"input":[],"name":"getOwner","output":"string","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"burn","output":"bool","type":"Action"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"},{"name":"_spender","type":"FixedHash<20>"}],"name":"allowance","output":"uint128","type":"Action"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Transfer","topic":2,"type":"Event"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Approval","topic":2,"type":"Event"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"}],"name":"balanceOf","output":"uint128","type":"Action"},{"constant":false,"input":[{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transfer","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_from","type":"FixedHash<20>"},{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transferFrom","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_spender","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"approve","output":"bool","type":"Action"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"string"},{"name":"arg2","type":"string"}],"name":"Mint","topic":1,"type":"Event"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Burn","topic":1,"type":"Event"},{"constant":false,"input":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"name":"init","output":"void","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"mint","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"}],"name":"setOwner","output":"bool","type":"Action"},{"constant":true,"input":[],"name":"getName","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getDecimals","output":"uint8","type":"Action"},{"constant":true,"input":[],"name":"getSymbol","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getTotalSupply","output":"uint128","type":"Action"}]';
// const DATContract = new web3.platon.Contract(JSON.parse(abi), contractAddress, {
//   vmType: 1,
// });

class center extends Component<any, state> {
  constructor(props: any) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      status: false,
      connected: '未连接到 MetaMask',
      DATContract: null,
      DATBalance: 0,

      selectedAddress: '',
    };
  }
  componentDidMount() {
    const _this = this;
    ethereum.on('accountsChanged', function (accounts: any) {
      //订阅 钱包地址更换地址
      console.log('钱包地址更换地址');
      _this.props.dispatch({
        //赋值全局
        type: 'common/update',
        payload: { accountAddress: accounts[0] || '' },
      });
      history.goBack(); //return the same way
      // Time to reload your interface with accounts[0]!
    });
    if (typeof ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      setTimeout(() => {
        console.log(this.props);
        if (this.props.accountAddress !== '' && this.props.accountAddress) {
          history.goBack(); //return the same way
        }
      }, 1000);
      // init DAT contract
      // var Web3A = require('web3');
      // const abi =
      //   '[{"constant":true,"input":[],"name":"getOwner","output":"string","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"burn","output":"bool","type":"Action"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"},{"name":"_spender","type":"FixedHash<20>"}],"name":"allowance","output":"uint128","type":"Action"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Transfer","topic":2,"type":"Event"},{"anonymous":false,"input":[{"name":"topic1","type":"FixedHash<20>"},{"name":"topic2","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Approval","topic":2,"type":"Event"},{"constant":true,"input":[{"name":"_owner","type":"FixedHash<20>"}],"name":"balanceOf","output":"uint128","type":"Action"},{"constant":false,"input":[{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transfer","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_from","type":"FixedHash<20>"},{"name":"_to","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"transferFrom","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_spender","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"approve","output":"bool","type":"Action"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"string"},{"name":"arg2","type":"string"}],"name":"Mint","topic":1,"type":"Event"},{"anonymous":false,"input":[{"name":"topic","type":"FixedHash<20>"},{"name":"arg1","type":"uint128"}],"name":"Burn","topic":1,"type":"Event"},{"constant":false,"input":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"name":"init","output":"void","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"},{"name":"_value","type":"uint128"}],"name":"mint","output":"bool","type":"Action"},{"constant":false,"input":[{"name":"_account","type":"FixedHash<20>"}],"name":"setOwner","output":"bool","type":"Action"},{"constant":true,"input":[],"name":"getName","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getDecimals","output":"uint8","type":"Action"},{"constant":true,"input":[],"name":"getSymbol","output":"string","type":"Action"},{"constant":true,"input":[],"name":"getTotalSupply","output":"uint128","type":"Action"}]';
      // var web3platon = new Web3A(window.ethereum);
      // let newContract =new web3platon.ethereum.Contract(
      //   JSON.parse(abi),
      //   'lat142epzrcpcsdelvzmv3e05mzurj8jtx4mutqpw3',
      //   { vmType: 1 },
      // )
      // this.setState({DATContract:newContract})
      // console.log(newContract)
      // connect to MetaMask wallet
    } else {
    }
  }
  async refreshBalance() {
    // query DAT balance
    // const balance = await this.state.DATContract.methods
    //   .balanceOf(this.selectedAddress)
    //   .call({});
    // this.DATBalance = balance;
  }
  sendTransaction() {
    window.web3a.platon.sendTransaction(
      {
        from: window.platon.selectedAddress,
        to: 'lat1dt2wx0xjkd2je8ev4t3ysmte6n90kc9gzndwuv',
        value: '10000000000000000',
      },
      function (err: any, transactionHash: any) {
        if (err) {
          console.log(err);
        } else {
          console.log(transactionHash);
        }
      },
    );
  }
  async login() {
    if (typeof window.ethereum !== 'undefined') {
      this.setState({
        selectedAddress: window.ethereum.selectedAddress,
      });
      const { selectedAddress } = this.state;
      ethereum.request({ method: 'eth_requestAccounts' });
      console.log('window.ethereum', ethereum[0], ethereum[1]);
      // connect to MetaMask wallet
      const _this = this;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        await this.props.dispatch({
          //assign global
          type: 'common/update',
          payload: { accountAddress: accounts[0] || '' },
        });
        history.goBack(); //return the same way
      }
    } else {
      confirm({
        title: '您还未安装metamask钱包，是否安装?',
        icon: <ExclamationCircleOutlined />,
        content:
          'MetaMask 可作为浏览器扩展和移动应用程序提供，为您提供密钥库、安全登录、令牌钱包和令牌交换——管理数字资产所需的一切。',
        onOk() {
          window.open('https://metamask.io/');
        },
        onCancel() {},
      });
    }
  }
  render() {
    return (
      <div>
        <div className={`max-body contain`}>
          <div className={styles.block}>
            <div className={styles.title}>这个是复制来的</div>
            <div className={`${styles.section}`}>
              <div className={styles.line}>
                强烈建议你在本应用的外部安全地创建/储存你的账户。在Chrome可使用下面的浏览器扩展
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={styles.line}>
                polkadot-js 扩展 （基本账户注入和签名者）
              </div>
              <div className={styles.line}>
                从这些扩展程序中的任何一个引入的账户都将出现在此应用程序中并同时使用。随着更多具有外部标志功能的扩展的出现，更多的可能会池逊更新。了解更多...
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={styles.line}>
                由于某些扩展程序（例如 polkdot-js
                扩展程序）可以保护您免受社区报告的所有网络钓鱼站点的侵害，因此即使您没有在其中存储账户，也有充分的理由使用它们来提供额外保护。
              </div>
            </div>
          </div>

          <div className={styles.hit}>
            你还没有登录。很多功能对你隐藏了，赶紧登录~
          </div>
          <Button
            onClick={() => this.login()}
            type="primary"
            shape="round"
            className={styles.btn}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}
export default connect((state: any) => {
  return {
    ...state['common'],
  };
})(center);
