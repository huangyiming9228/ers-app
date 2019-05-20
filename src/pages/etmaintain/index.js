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

  handleFaultListClick = () => Taro.navigateTo({
    url: '../../pages/faultlist/index'
  })

  handleMachineClick = () => Taro.navigateTo({
    url: '../../pages/machine/index'
  })

  handleWarehouseClick = () => Taro.navigateTo({
    url: '../../pages/warehouse/index'
  })

  render() {
    return (
      <View>
        <PageHeader title='设备维护' />
        <ListTitle title='列表' />
        <AtList>
          <AtListItem title='故障处理' arrow='right' onClick={this.handleFaultHandingClick} />
          <AtListItem title='待处理故障' arrow='right' onClick={this.handleFaultListClick} />
          <AtListItem title='机房设备检查' arrow='right' onClick={this.handleMachineClick} />
          <AtListItem title='库房巡检' arrow='right' onClick={this.handleWarehouseClick} />
        </AtList>
      </View>
    )
  }
}
