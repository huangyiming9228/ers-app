import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
  AtImagePicker,
  AtList,
  AtTextarea,
  AtButton,
  AtMessage,
  AtActivityIndicator,
  AtRadio,
  AtInput,
} from 'taro-ui'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'
import CustomPicker from '../components/CustomPicker'

@connect(({ ups, loading }) => ({
  ...ups,
  initialLoading: loading.effects['ups/getUpsAreaList'],
  submitLoading: loading.effects['ups/submit'],
}))
export default class UPS extends Component {
  config = {
    navigationBarTitleText: 'UPS巡检'
  }

  state = {
    files: [],
  }

  componentDidMount() {
    this.props.dispatch(Action('ups/getUpsAreaList'))
  }

  handleAreaChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('ups/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('ups/getUpsRoomList'))
  }

  handleRoomChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('ups/save', {
      selectedRoom: roomList[e.detail.value]
    }))
  }

  handleRadioChange = (value, radioName) => {
    const { record, dispatch } = this.props;
    dispatch(Action('ups/save', {
      record: {
        ...record,
        [radioName]: value
      }
    }));
  }

  handleTemperatureChange = value => this.props.dispatch(Action('ups/save', { temperature: value }))

  handleCommentsChange = e => this.props.dispatch(Action('ups/save', {
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
        dispatch(Action('ups/save', {
          imageList: [...imageList, data]
        }));
        Taro.hideLoading();
      });
    } else {
      imageList.splice(index, 1);
      dispatch(Action('ups/save', {
        imageList
      }));
    }
  }

  handleSubmit = () => {
    const { selectedRoom: { id: room_id }, imageList, dispatch, temperature } = this.props;
    if (!room_id) {
      Taro.atMessage({
        message: '请选择教室',
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
    dispatch(Action('ups/submit'))
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
      temperature,
    } = this.props;
    const { files } = this.state;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title='巡检教室' />
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
                title='选择教室'
                value={selectedRoom.room_name}
                onChange={this.handleRoomChange}
                placeholder='点击选择教室'
              />
            </AtList>
            <ListTitle title='主机是否正常' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.host_flag}
              onClick={(value) => this.handleRadioChange(value, 'host_flag')}
            />
            <ListTitle title='外壳是否漏电' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.shell_flag}
              onClick={(value) => this.handleRadioChange(value, 'shell_flag')}
            />
            <ListTitle title='电池是否老化' />
            <AtRadio
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              value={record.power_flag}
              onClick={(value) => this.handleRadioChange(value, 'power_flag')}
            />
            <ListTitle title='空调是否正常' />
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
