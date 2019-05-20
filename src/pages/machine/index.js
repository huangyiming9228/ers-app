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

@connect(({ machine, loading }) => ({
  ...machine,
  initialLoading: loading.effects['machine/getMachineAreaList'],
  submitLoading: loading.effects['machine/submit'],
}))
export default class Machine extends Component {
  config = {
    navigationBarTitleText: '机房设备巡检'
  }

  state = {
    files: [],
  }

  componentDidMount() {
    this.props.dispatch(Action('machine/getMachineAreaList'))
  }

  handleAreaChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('machine/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('machine/getMachineRoomList'))
  }

  handleRoomChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('machine/save', {
      selectedRoom: roomList[e.detail.value]
    }))
  }

  handleRadioChange = (value, radioName) => {
    const { record, dispatch } = this.props;
    dispatch(Action('machine/save', {
      record: {
        ...record,
        [radioName]: value
      }
    }));
  }

  handleTemperatureChange = value => this.props.dispatch(Action('machine/save', { temperature: value }))

  handleCommentsChange = e => this.props.dispatch(Action('machine/save', {
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
        dispatch(Action('machine/save', {
          imageList: [...imageList, data]
        }));
        Taro.hideLoading();
      });
    } else {
      imageList.splice(index, 1);
      dispatch(Action('machine/save', {
        imageList
      }));
    }
  }

  handleSubmit = () => {
    const { selectedRoom: { id: room_id }, temperature, imageList, dispatch } = this.props;
    if (!room_id) {
      Taro.atMessage({
        message: '请选择机房',
        type: 'error',
        duration: 1500
      });
      return;
    }
    if (!temperature) {
      Taro.atMessage({
        message: '请填写室温！',
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
    dispatch(Action('machine/submit'))
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
      temperature,
      comments,
    } = this.props;
    const { files } = this.state;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title='巡检机房' />
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
                title='选择机房'
                value={selectedRoom.room_name}
                onChange={this.handleRoomChange}
                placeholder='点击选择机房'
              />
            </AtList>
            <ListTitle title='服务器运行情况' />
            <AtRadio
              options={[
                { label: '正常', value: '1' },
                { label: '异常', value: '0' },
              ]}
              value={record.server_flag}
              onClick={(value) => this.handleRadioChange(value, 'server_flag')}
            />
            <ListTitle title='存储运行情况' />
            <AtRadio
              options={[
                { label: '正常', value: '1' },
                { label: '异常', value: '0' },
              ]}
              value={record.store_flag}
              onClick={(value) => this.handleRadioChange(value, 'store_flag')}
            />
            <ListTitle title='服务器电源' />
            <AtRadio
              options={[
                { label: '正常', value: '1' },
                { label: '异常', value: '0' },
              ]}
              value={record.serverpower_flag}
              onClick={(value) => this.handleRadioChange(value, 'serverpower_flag')}
            />
            <ListTitle title='网络设备运行情况' />
            <AtRadio
              options={[
                { label: '正常', value: '1' },
                { label: '异常', value: '0' },
              ]}
              value={record.network_flag}
              onClick={(value) => this.handleRadioChange(value, 'network_flag')}
            />
            <ListTitle title='空调是否运行正常' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.air_flag}
              onClick={(value) => this.handleRadioChange(value, 'air_flag')}
            />
            <ListTitle title='清洁卫生是否打扫' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.clean_flag}
              onClick={(value) => this.handleRadioChange(value, 'clean_flag')}
            />
            <ListTitle title='室温' />
            <AtInput
              name='temperature'
              title='室温'
              type='text'
              placeholder='请填写室温（℃）'
              value={temperature}
              onChange={this.handleTemperatureChange}
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
