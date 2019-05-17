import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import PageHeader from '../components/PageHeader'
import ListTitle from '../components/ListTitle'

export default class EtManage extends Component {
  config = {
    navigationBarTitleText: '设备管理'
  }

  render() {
    return (
      <View>
        <PageHeader title='设备管理' />
        <ListTitle title='列表' />
        <AtList>
          <AtListItem title='设备查看' arrow='right' />
          <AtListItem title='设备外借' arrow='right' />
          <AtListItem title='综治安全记录' arrow='right' />
        </AtList>
      </View>
    )
  }
}
