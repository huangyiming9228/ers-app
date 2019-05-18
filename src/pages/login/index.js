import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import Action from '../../utils/action'

@connect(({ login, loading }) => ({
  ...login,
  loading: loading.effects['login/login'],
}))
export default class Login extends Component {

  config = {
    navigationBarTitleText: '西柚设备管理工具'
  }

  hanldeNoChange = (event) => {
    const value = event.target.value;
    this.props.dispatch(Action('login/save', { user_no: value }));
  }

  hanldePswChange = (event) => {
    const value = event.target.value;
    this.props.dispatch(Action('login/save', { psw: value }));
  }

  showToast(text) {
    Taro.showToast({
      title: text,
      icon: 'none',
    });
  }

  handleFoodcomplaintClick = () => Taro.navigateTo({
    url: '../../pages/foodcomplaint/index'
  })

  handleFaultcomplaintClick = () => Taro.navigateTo({
    url: '../../pages/faultcomplaint/index'
  })

  login = () => {
    const { user_no, psw, dispatch } = this.props;
    if (!user_no || !psw) {
      this.showToast('请输入员工号和密码！');
    } else {
      dispatch(Action('login/login'));
    }
  }

  render () {
    const { user_no, psw, loading } = this.props;
    return (
      <View className='login-page' id='login-page'>
        <View className='title'>您好，请登录</View>
        <View className='title-des'>多媒体教室故障报修系统</View>
        <View className='bgtopWrap'>
          <View className='loginWrap'>
            <View className='inpuWrapMpblie'>
              <Input
                type='text'
                maxLength='12'
                placeholder='请输入员工号'
                value={user_no}
                onInput={this.hanldeNoChange}
              />
            </View>
            <View className='inpuWrapNumber'>
              <Input
                type='password'
                placeholder='请输入密码'
                value={psw}
                onInput={this.hanldePswChange}
              />
            </View>
            <Button className='button' onClick={this.login} loading={loading}>
              登录
            </Button>
            <View className='see-des'>
              <Text onClick={this.handleFoodcomplaintClick}>卫生投诉</Text>
              <Text onClick={this.handleFaultcomplaintClick}>故障投诉</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
