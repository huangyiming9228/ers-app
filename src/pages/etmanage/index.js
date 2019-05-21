import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtMessage } from 'taro-ui'
import PageHeader from '../components/PageHeader'
import ListTitle from '../components/ListTitle'

export default class EtManage extends Component {
  config = {
    navigationBarTitleText: '西柚设备管理工具'
  }

  handleEtCheckClick = () => Taro.navigateTo({
    url: '../../pages/etcheck/index'
  })

  handleEtCheckOutClick = () => {
    const { user_no } = Taro.getStorageSync('user');
    const authArray = ['admin', '200731010098', '201499010077', '201899010045', '2019001'];
    if (authArray.includes(user_no)) {
      Taro.navigateTo({
        url: '../../pages/etcheckout/index'
      })
    } else {
      Taro.atMessage({
        message: '您没有权限使用此功能！',
        type: 'error',
        duration: 1500
      });
    }
  }

  handleSafetyRecordClick = () => {}

  render() {
    return (
      <View>
        <PageHeader title='设备管理' />
        <ListTitle title='列表' />
        <AtList>
          <AtListItem title='设备查看' arrow='right' onClick={this.handleEtCheckClick} />
          <AtListItem title='设备外借' arrow='right' onClick={this.handleEtCheckOutClick} />
          <AtListItem title='综治安全记录' arrow='right' onClick={this.handleSafetyRecordClick} />
        </AtList>
        <AtMessage />
      </View>
    )
  }
}
