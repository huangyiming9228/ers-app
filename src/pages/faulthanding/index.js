import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtList,
  AtActivityIndicator,
  AtButton,
  AtDivider,
  AtMessage,
  AtListItem,
} from 'taro-ui'
import CustomPicker from '../components/CustomPicker'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'

@connect(({ faulthanding, loading}) => ({
  ...faulthanding,
  initialLoading: loading.effects['faulthanding/getAreas'],
  queryLoading: loading.effects['faulthanding/getEquipments'],
}))
export default class FaultHanding extends Component {
  config = {
    navigationBarTitleText: '故障处理'
  }

  componentDidMount() {
    this.props.dispatch(Action('faulthanding/getAreas'))
  }

  handleAreaChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('faulthanding/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('faulthanding/getRooms'))
  }

  handleRoomChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('faulthanding/save', {
      selectedRoom: roomList[e.detail.value]
    }))
  }

  handleQueryEquipments = () => {
    const {
      selectedArea: { id: area_id },
      selectedRoom: { id: room_id },
      dispatch
    } = this.props;
    if (area_id && room_id) {
      dispatch(Action('faulthanding/getEquipments', {
        room_id
      }))
    } else {
      Taro.atMessage({
        'message': '请选择区域和教室！',
        'type': 'error',
      })
    }
  }

  handleEquipmentClick = item => {
    this.props.dispatch(Action('faulthanding/save', {
      selectedEquipment: item,
      selectedFaultList: [],
    }))
    Taro.navigateTo({
      url: '../../pages/faulthanding_subpage/index'
    })
  }

  render() {
    const {
      initialLoading = true,
      queryLoading,
      areaList,
      roomList,
      selectedArea,
      selectedRoom,
      equipmentList,
    } = this.props;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <AtList>
              <CustomPicker
                mode='selector'
                name='selectedArea'
                range={areaList}
                rangeKey='area_name'
                title='选择区域'
                value={selectedArea.area_name}
                onChange={this.handleAreaChange}
              />
              <CustomPicker
                mode='selector'
                name='selectedRoom'
                range={roomList}
                rangeKey='room_name'
                title='选择教室'
                value={selectedRoom.room_name}
                onChange={this.handleRoomChange}
              />
            </AtList>
            <View style={{ margin: '15px 20px' }}>
              <AtButton type='primary' loading={queryLoading} onClick={this.handleQueryEquipments}>查询</AtButton>
            </View>
            <ListTitle title='设备列表' />
            <View>
              {
                equipmentList.length === 0 ?
                <AtDivider content='暂无数据' fontColor='#ccc' lineColor='#ccc' /> :
                <AtList>
                  {
                    equipmentList.map(item => <AtListItem
                      key={item.id}
                      title={item.type}
                      arrow='right'
                      extraText='处理'
                      note={`${item.et_status === 1 ? '正常' : '故障'}`}
                      onClick={() => this.handleEquipmentClick(item)}
                    />)
                  }
                </AtList>
              }
            </View>
          </View>
        }
      <AtMessage />
      </View>
    )
  }
}
