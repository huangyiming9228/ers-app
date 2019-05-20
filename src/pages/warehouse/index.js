import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
  AtImagePicker,
  AtList,
  AtInput,
  AtTextarea,
  AtButton,
  AtMessage,
  AtActivityIndicator,
  AtRadio,
} from 'taro-ui'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'
import CustomPicker from '../components/CustomPicker'

@connect(({ warehouse, loading }) => ({
  ...warehouse,
  initialLoading: loading.effects['warehouse/getWarehouseAreaList'],
  submitLoading: loading.effects['warehouse/submit'],
}))
export default class Warehouse extends Component {
  config = {
    navigationBarTitleText: '库房巡检'
  }

  state = {
    files: [],
  }

  componentDidMount() {
    this.props.dispatch(Action('warehouse/getWarehouseAreaList'))
  }

  handleAreaChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('warehouse/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('warehouse/getWarehouseRoomList'))
  }

  handleRoomChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('warehouse/save', {
      selectedRoom: roomList[e.detail.value]
    }))
  }

  handleRadioChange = (value, radioName) => {
    const { record, dispatch } = this.props;
    dispatch(Action('warehouse/save', {
      record: {
        ...record,
        [radioName]: value
      }
    }));
  }

  handleCommentsChange = e => this.props.dispatch(Action('warehouse/save', {
    comments: e.target.value
  }))

  handleImageChange = (files, operationType, index) => {
    const { dispatch, imageList } = this.props;
    const { files: oldFiles } = this.state;
    this.setState({ files });
    if (operationType === 'add') {
      const addedImage = files.filter(item => !oldFiles.find(oldItem => oldItem.url === item.url))[0];
      Taro.showLoading({
        title: '图片上传中...',
        mask: true
      });
      Taro.uploadFile({
        url: 'http://localhost/ers/api/base/image_upload',
        filePath: addedImage.url,
        name: 'image'
      }).then(res => {
        const { data } = JSON.parse(res.data);
        dispatch(Action('warehouse/save', {
          imageList: [...imageList, data]
        }));
        Taro.hideLoading();
      });
    } else {
      imageList.splice(index, 1);
      dispatch(Action('warehouse/save', {
        imageList
      }));
    }
  }

  handleSubmit = () => {
    const { selectedRoom: { id: room_id }, imageList, dispatch } = this.props;
    if (!room_id) {
      Taro.atMessage({
        message: '请选择库房',
        type: 'error',
        duration: 1500
      });
      return;
    }
    if (imageList.length === 0) {
      Taro.atMessage({
        message: '请上传检查照片！',
        type: 'error',
        duration: 1500
      });
      return;
    }
    dispatch(Action('warehouse/submit'))
  }

  render() {
    const {
      initialLoading = true,
      submitLoading,
      areaList,
      roomList,
      selectedArea,
      selectedRoom,
      record,
      comments,
    } = this.props;
    const { files } = this.state;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title='巡检库房' />
            <AtList>
              <CustomPicker
                mode='selector'
                name='selectedArea'
                range={areaList}
                rangeKey='area_name'
                title='选择区域'
                value={selectedArea.area_name}
                onChange={this.handleAreaChange}
                placeholder='点击选择区域'
              />
              <CustomPicker
                mode='selector'
                name='selectedRoom'
                range={roomList}
                rangeKey='room_name'
                title='选择库房'
                value={selectedRoom.room_name}
                onChange={this.handleRoomChange}
                placeholder='点击选择库房'
              />
            </AtList>
            <ListTitle title='门窗是否关闭' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.door_flag}
              onClick={(value) => this.handleRadioChange(value, 'door_flag')}
            />
            <ListTitle title='环境是否安全' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.env_flag}
              onClick={(value) => this.handleRadioChange(value, 'env_flag')}
            />
            <ListTitle title='设备是否正常存放' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.et_flag}
              onClick={(value) => this.handleRadioChange(value, 'et_flag')}
            />
            <ListTitle title='备注' />
            <View style={{ margin: '10px 20px' }}>
              <AtTextarea
                value={comments}
                onChange={this.handleCommentsChange}
                maxLength={200}
                placeholder='请填写备注'
              />
            </View>
            <ListTitle title='上传检查照片' />
            <View style={{ marginLeft: '10px' }}>
              <AtImagePicker
                length={3}
                files={files}
                onChange={this.handleImageChange}
                showAddBtn={files.length < 3}
                multiple={false}
              />
            </View>
            <View style={{ margin: '15px 20px' }}>
              <AtButton type='primary' loading={submitLoading} onClick={this.handleSubmit}>{submitLoading ? '提交中...' : '提交'}</AtButton>
            </View>
          </View>
        }
        <AtMessage />
      </View>
    )
  }
}
