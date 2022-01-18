import { Redirect, connect } from 'umi';
const ethereum = window.ethereum;

export default (props: any) => {
  // console.log(ethereum.selectedAddress)
  const isLogin = true;
  if (ethereum.selectedAddress !== '' && ethereum.selectedAddress) {
    return <div>{props.children}</div>;
  } else {
    return <Redirect to="/login" />;
  }
};
