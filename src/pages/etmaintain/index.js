import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import PageHeader from '../components/PageHeader'
import ListTitle from '../components/ListTitle'

export default class EtManage extends Component {
  config = {
    navigationBarTitleText: '西柚设备管理工具'
  }

  handleFaultHandingClick = () => Taro.navigateTo({
    url: '../../pages/faulthanding/index'
  })

  render() {
    return (
      <View>
        <PageHeader title='设备维护' />
        <ListTitle title='列表' />
        <AtList>
          <AtListItem title='故障处理' arrow='right' onClick={this.handleFaultHandingClick} />
        </AtList>
      </View>
    )
  }
}
