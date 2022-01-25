import React, { Component } from 'react';

import { Layout, Menu, Input, Tooltip, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import './common.css';
import classNames from 'classnames';
import styles from './common.less';
import { ContainerQuery } from 'react-container-query';
import { history, NavLink, Link, connect } from 'umi';
const { TabPane } = Tabs;
import { debounce } from '@/utils/utils';
import { get, post } from '@/utils/server';
const ethereum = window.ethereum;
class common extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.tabsChange = this.tabsChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.searchValueChange = this.searchValueChange.bind(this);
    this.state = {
      current: '',
      address: '',
      searchValue: '',
    };
  }

  async componentDidMount() {
    const _this = this;
    const newConfig: any = await get('/config');
    this.props.dispatch({
      type: `common/update`,
      payload: {
        config: newConfig,
      },
    });

    if (ethereum !== 'undefined') {
      await setTimeout(() => {
        _this.setState({ address: ethereum.selectedAddress || '' });
        _this.props.dispatch({
          //赋值全局
          type: 'common/update',
          payload: { accountAddress: ethereum.selectedAddress || '' },
        });
      }, 500);
    }
    this.setResize();
    window.addEventListener('resize', debounce(this.setResize.bind(this))); // listener window resize

    history.listen((location, action) => {
      if (location.pathname) {
        if (location.pathname === '/') {
          _this.setState({ current: '1' });
        } else if (location.pathname === '/storage') {
          _this.setState({ current: '2' });
        } else if (location.pathname === '/order') {
          _this.setState({ current: '3' });
        } else {
          _this.setState({ current: '' });
        }
      }
    });
    ethereum.on('accountsChanged', function (accounts: any) {
      //订阅 钱包地址更换地址
      _this.setState({ address: accounts[0] || '' });
    });
  }

  setResize() {
    const wh = window.innerHeight;
    this.props.dispatch({
      type: `common/update`,
      payload: {
        navHeight: document.querySelector('.nav')?.clientHeight,
        wHeight: window.innerHeight,
      },
    });
  }
  componentWillUnmount() {
    //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.setResize.bind(this));
  }
  // };
  tabsChange(key: String) {
    this.setState({ current: key });
    switch (key) {
      case '1':
        history.push('/');
        break;
      case '2':
        history.push('/storage');
        break;
      case '3':
        history.push('/order');
        break;
      default:
        break;
    }
  }
  searchValueChange(val: any) {
    this.setState({ searchValue: val?.target.value });
  }
  searchSubmit(val: any) {
    const { searchValue } = this.state;
    window.open(
      `https://scan.platon.network/address-detail?address=${searchValue}`,
    );
  }

  render() {
    const query = {
      'screen-xs': {
        maxWidth: 575,
      },
      'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
      },
      'screen-md': {
        minWidth: 768,
        maxWidth: 1199,
      },
      'screen-lg': {
        minWidth: 1200,
        maxWidth: 1399,
      },
      'screen-xl': {
        minWidth: 1400,
      },
    };
    const { current, address, searchValue } = this.state;
    const myTabs = (
      <Tabs
        defaultActiveKey={current}
        activeKey={current}
        className={`tabs`}
        onTabClick={this.tabsChange}
      >
        <TabPane tab="首页" key="1"></TabPane>
        <TabPane tab="存储节点" key="2"></TabPane>
        <TabPane tab="订单列表" key="3"></TabPane>
      </Tabs>
    );
    const layout = (
      <Layout className={styles.layout} style={{ minHeight: '100vh' }}>
        <div className={`nav ${styles.nav}`}>
          <div className={styles.n_row}>
            <div className={styles.logo}>
              <NavLink to="/">
                <img src={require('@/assets/logo.png')} alt="logo" />
              </NavLink>
            </div>

            {myTabs}
            <div className="flex flex_ac">
              <Input
                className={styles.input}
                placeholder="请输入交易哈希/账户地址查询"
                onChange={this.searchValueChange}
                onPressEnter={this.searchSubmit}
                suffix={
                  <SearchOutlined
                    onClick={this.searchSubmit}
                    style={{
                      color: 'RGBA(109, 112, 145, 1)',
                      fontSize: '26px',
                      cursor: 'pointer',
                    }}
                  />
                }
              />
              <div className={styles.user}>
                {address && address !== '' ? (
                  <Link to="/center">
                    <Tooltip
                      placement="bottom"
                      title={address}
                      className={styles.tooltip}
                    >
                      <img
                        src={require('@/assets/default.jpg')}
                        alt="logo"
                        className={styles.userlogo}
                      />
                      <div className={styles.name}>{address}</div>
                    </Tooltip>
                  </Link>
                ) : (
                  <Link to="/login">
                    <div className={styles.name}>账户？</div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <Content
          className="site-layout"
          style={{ padding: '0 0px', marginTop: 100 }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: 380 }}
          >
            {this.props.children}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    );

    return (
      <ContainerQuery query={query}>
        {(params) => <div className={`${classNames(params)}`}>{layout}</div>}
      </ContainerQuery>
    );
  }
}
export default connect((state: any) => {
  return {
    ...state['common'],
  };
})(common);
