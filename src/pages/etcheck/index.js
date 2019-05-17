import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtList, AtActivityIndicator, AtButton, AtDivider, AtMessage, AtListItem, AtFloatLayout  } from 'taro-ui'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'

@connect(({ etcheck, loading }) => ({
  ...etcheck,
  initialLoading: loading.effects['etcheck/getAreas'],
  queryLoading: loading.effects['etcheck/getEquipments'],
  submitLoading: loading.effects['etcheck/updateEquipmentInfo'],
}))
export default class EtCheck extends Component {

  config = {
    navigationBarTitleText: '设备查看'
  }

  state = {
    floatOpened: false
  }

  componentDidMount() {
    this.props.dispatch(Action('etcheck/getAreas'))
  }

  handleAreaPickerChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('etcheck/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('etcheck/getRooms'))
  }

  handleRoomPickerChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('etcheck/save', {
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
      dispatch(Action('etcheck/getEquipments', {
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
    this.props.dispatch(Action('etcheck/save', {
      selectedEquipment: item
    }))
    this.setState({ floatOpened: true })
  }

  handleFloatClose = () => this.setState({ floatOpened: false })

  handleFloatAreaPickerChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('etcheck/save', {
      floatSelectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('etcheck/getFloatRooms'))
  }

  handleFloatRoomPickerChange = e => {
    const { floatRoomList, dispatch } = this.props;
    dispatch(Action('etcheck/save', {
      floatSelectedRoom: floatRoomList[e.detail.value]
    }))
  }

  handleSubmit = () => this.props.dispatch(Action('etcheck/updateEquipmentInfo')).then(() => this.setState({ floatOpened: false }))

  render() {
    const {
      initialLoading = true,
      areaList,
      selectedArea,
      roomList,
      selectedRoom,
      equipmentList,
      queryLoading,
      selectedEquipment,
      floatSelectedArea,
      floatSelectedRoom,
      floatRoomList,
      submitLoading,
    } = this.props;
    const {
      floatOpened
    } = this.state;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <AtList>
              <Picker
                mode='selector'
                range={areaList}
                rangeKey='area_name'
                onChange={this.handleAreaPickerChange}
              >
                <AtInput
                  name='area_id'
                  title='选择区域'
                  type='text'
                  value={selectedArea.area_name}
                />
              </Picker>
              <Picker
                mode='selector'
                range={roomList}
                rangeKey='room_name'
                onChange={this.handleRoomPickerChange}
              >
                <AtInput
                  name='room_id'
                  title='选择教室'
                  type='text'
                  value={selectedRoom.room_name}
                />
              </Picker>
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
                      extraText='修改存放地址'
                      note={`${item.et_status === 1 ? '正常' : '故障'} - ${item.et_no}`}
                      onClick={() => this.handleEquipmentClick(item)}
                    />)
                  }
                </AtList>
              }
            </View>
          </View>
        }
      <AtMessage />
      <AtFloatLayout
        isOpened={floatOpened}
        title={`${selectedEquipment.type} - ${selectedEquipment.et_no}`}
        onClose={this.handleFloatClose}
      >
        <AtList>
          <Picker
            mode='selector'
            range={areaList}
            rangeKey='area_name'
            onChange={this.handleFloatAreaPickerChange}
          >
            <AtInput
              name='area_id'
              title='选择区域'
              type='text'
              value={floatSelectedArea.area_name}
            />
          </Picker>
          <Picker
            mode='selector'
            range={floatRoomList}
            rangeKey='room_name'
            onChange={this.handleFloatRoomPickerChange}
          >
            <AtInput
              name='room_id'
              title='选择教室'
              type='text'
              value={floatSelectedRoom.room_name}
            />
          </Picker>
        </AtList>
        <View style={{ margin: '15px 20px' }}>
          <AtButton type='primary' loading={submitLoading} onClick={this.handleSubmit}>确定</AtButton>
        </View>
      </AtFloatLayout>
      </View>
    )
  }
}
