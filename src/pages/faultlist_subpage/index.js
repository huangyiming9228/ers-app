import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtList,
  AtButton,
  AtListItem,
} from 'taro-ui'
import ListTitle from '../components/ListTitle'
import Action from '../../utils/action'

@connect(({ faultlist, loading }) => ({
  ...faultlist,
  submitLoading: loading.effects['faultlist/submit'],
}))
export default class FaultListSubPage extends Component {
  config = {
    navigationBarTitleText: '待处理故障'
  }

  handleSubmit = () => this.props.dispatch(Action('faultlist/submit'))

  render() {
    const {
      handingFault,
      submitLoading
    } = this.props;
    const { fault_list: faultList = [] } = handingFault;
    return (
      <View>
        <ListTitle title='故障详情' />
        <AtList>
          <AtListItem title='区域' note={handingFault.area_name} />
          <AtListItem title='教室' note={handingFault.room_name} />
          <AtListItem title='设备类型' note={handingFault.equipment_info.type} />
          <AtListItem title='设备名称' note={handingFault.equipment_info.et_name} />
          <AtListItem title='设备型号' note={handingFault.equipment_info.et_no} />
          <AtListItem title='报修时间' note={handingFault.submit_time} />
          <AtListItem title='报修人' note={handingFault.transfer_name} />
          <AtListItem title='技术人员' note={handingFault.user_name} />
        </AtList>
        <ListTitle title='故障点' />
        <AtList>
          {
            faultList.map((item, index) => <AtListItem
              key={item.id}
              title={`${index + 1}. ${item.fault_name}`}
              hasBorder={false}
            />)
          }
        </AtList>
        <View style={{ margin: '15px 20px' }}>
          <AtButton type='primary' loading={submitLoading} onClick={this.handleSubmit}>{submitLoading ? '保存中...' : '处理完毕'}</AtButton>
        </View>
      </View>
    )
  }
  
}
