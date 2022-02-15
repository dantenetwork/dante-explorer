import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './home.less';
import './home.css';
import { format, toSize } from '@/utils/utils';
import { Carousel, message } from 'antd';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
import { config } from '@/config';
function Home(props: any) {
  const [statusData, setData] = useState({
    cur_period_total_capacity: 0,
    total_staker_count: 0,
    nodes_number: 0,
  });
  useEffect(() => {
    // 需要在 componentDidMount 执行的内容
    init();

    return () => {
      // 需要在 componentWillUnmount 执行的内容
    };
  }, []);

  const init = async () => {
    try {
      let data: any = await get(api.home.global_info);
      setData((oldData) => ({
        ...oldData,
        ...data,
      }));
    } catch (error: any) {
      message.error(error);
    }
    // console.log(props)
    // props.dispatch({
    //   type: 'home/getglobalinfo',
    //   payload: {
    //     // page: current,
    //     // pageSize: pagesize,
    //     // adminId: id
    //   }
    // })

    // let apiArray=[
    //   get(api.home.global_info),
    //   get(api.home.miner_count)
    // ]
    // Promise.allSettled(apiArray).then(([globalInfo,minerCount]:any)=>{
    //   let cur_period_total_capacity = 0;
    //   if(globalInfo.status==='rejected'){
    //     message.error('get globalInfo error');
    //   }else{
    //     cur_period_total_capacity =Number((globalInfo?.value[9] / 1024) * 1024 * 1024)
    //   }

    //   if(minerCount.status==='rejected'){
    //     message.error('get minerCount error');
    //   }else{
    //     cur_period_total_capacity =Number((minerCount?.value[0] / 1024) * 1024 * 1024)
    //   }

    //   console.log(minerCount)
    //   setData(data=>({
    //     ...data,
    //     cur_period_total_capacity: cur_period_total_capacity,
    //   }))
    // })
  };
  const banner = (
    // autoplay
    <Carousel className={`banner ${styles.banner}`}>
      <div>
        <img
          src={require('@/assets/home/banner.jpg')}
          className={styles.banner_img}
          alt=""
        />
      </div>
      {/* <div>
        <img src={require('@/assets/home/banner.jpg')} alt="" />
      </div> */}
    </Carousel>
  );
  return (
    <div>
      {banner}
      <div className={`${styles.contain} max-body contain`}>
        <div className={styles.title}>全网状态</div>

        <div className={`flex flex_jcac ${styles.statu}`}>
          <div className={styles.status}>
            <div className={styles.fstatus_title}>全网容量</div>
            <div className={styles.fstatus_txt}>
              {toSize(statusData.cur_period_total_capacity)}
            </div>
          </div>
          <div className={styles.status}>
            <div className={styles.fstatus_title}>存储节点数量</div>
            <div className={styles.fstatus_txt}>
              {format(statusData.nodes_number)}
            </div>
          </div>
          <div className={styles.status}>
            <div className={styles.fstatus_title}>全网委托者数量</div>
            <div className={styles.fstatus_txt}>
              {format(statusData.total_staker_count)}
            </div>
          </div>
          <div className={styles.status}>
            <div className={styles.fstatus_title}>本周期全网收益</div>
            <div className={styles.fstatus_txt}>567,567,492,DAT</div>
          </div>
        </div>

        <div className={styles.title}>最新事件</div>

        <div className={styles.event}>
          <div className={styles.events}>
            <div className={styles.line}>
              <div className={styles.events_txt}>状态：</div>
              <div
                className={`flex flex_jcac ${styles.events_status} ${styles.wait}`}
              >
                等待接单
              </div>

              <div className={styles.events_txt}>交易哈希：</div>
              <div className={styles.events_value}>
                oxdjnwejflvhlvhefvhrfjgrdlfgdfjdfbghj;bhjsjdk
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.events_txt}>
                订单交易概况描述，根据服务端返回内容显示XXXXXXXXXXXXXXXXX
              </div>
            </div>
          </div>

          <div className={styles.events}>
            <div className={styles.line}>
              <div className={styles.events_txt}>状态：</div>
              <div
                className={`flex flex_jcac ${styles.events_status} ${styles.full}`}
              >
                订单已接满
              </div>

              <div className={styles.events_txt}>交易哈希：</div>
              <div className={styles.events_value}>
                oxdjnwejflvhlvhefvhrfjgrdlfgdfjdfbghj;bhjsjdk
              </div>
            </div>
            <div className={styles.line}>
              <img
                src={require('@/assets/logo.png')}
                className={styles.events_avatar}
                alt=""
              />

              <div className={styles.events_txt}>交易哈希：</div>
              <div className={styles.events_value}>
                oxdjnwejflvhlvhefvhrfjgrdlfgdfjdfbghj;bhjsjdk
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.events_txt}>
                订单交易概况描述，根据服务端返回内容显示XXXXXXXXXXXXXXXXX
              </div>
            </div>
          </div>

          <div className={styles.events}>
            <div className={styles.line}>
              <div className={styles.events_txt}>状态：</div>
              <div
                className={`flex flex_jcac ${styles.events_status} ${styles.fail}`}
              >
                订单失败
              </div>

              <div className={styles.events_txt}>交易哈希：</div>
              <div className={styles.events_value}>
                oxdjnwejflvhlvhefvhrfjgrdlfgdfjdfbghj;bhjsjdk
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.events_txt}>
                订单交易概况描述，根据服务端返回内容显示XXXXXXXXXXXXXXXXX
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect((state: any) => {
  return {
    ...state['home'],
    ...state['common'],
    // loading: state.loading.models[MODELS_NAME]
  };
})(Home);
