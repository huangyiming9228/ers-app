import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PageHeader from '../components/PageHeader'
import ListTitle from '../components/ListTitle'

export default class EtManage extends Component {
  config = {
    navigationBarTitleText: '西柚设备管理工具'
  }
  render() {
    return (
      <View>
        <PageHeader title='个人中心' />
        <ListTitle title='列表' />
      </View>
    )
  }
}
