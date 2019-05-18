import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtList, AtCheckbox, AtTextarea, AtImagePicker, AtActivityIndicator, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'
import CustomPicker from '../components/CustomPicker'

@connect(({ foodcomplaint, loading }) => ({
  ...foodcomplaint,
  initialLoading: loading.effects['foodcomplaint/getAreaList'],
  submitLoading: loading.effects['foodcomplaint/submit']
}))
export default class FoodComplaint extends Component {

  config = {
    navigationBarTitleText: '卫生投诉'
  }

  state = {
    files: []
  }

  componentDidMount() {
    this.props.dispatch(Action('foodcomplaint/getAreaList'))
  }

  handleCheckboxChange = value => this.props.dispatch(Action('foodcomplaint/save', {
    selectedList: value
  }))

  handleOtherChange = e => this.props.dispatch(Action('foodcomplaint/save', {
    other: e.target.value
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
        dispatch(Action('foodcomplaint/save', {
          imageList: [...imageList, data]
        }));
        Taro.hideLoading();
      });
    } else {
      imageList.splice(index, 1);
      dispatch(Action('foodcomplaint/save', {
        imageList
      }));
    }
  }

  handleAreaChange = e => {
    const { areaList, dispatch } = this.props;
    dispatch(Action('foodcomplaint/save', {
      selectedArea: areaList[e.detail.value]
    }))
    dispatch(Action('foodcomplaint/getRooms'))
  }

  handleRoomChange = e => {
    const { roomList, dispatch } = this.props;
    dispatch(Action('foodcomplaint/save', {
      selectedRoom: roomList[e.detail.value]
    }))
  }

  handleSubmit = () => {
    const {
      selectedRoom,
      imageList,
      dispatch
    } = this.props;
    if (!selectedRoom.id) {
      Taro.atMessage({
        message: '请选择教室！',
        type: 'error',
        duration: 1500
      });
      return;
    }
    if (imageList.length === 0) {
      Taro.atMessage({
        message: '请上传图片！',
        type: 'error',
        duration: 1500
      });
      return;
    }
    dispatch(Action('foodcomplaint/submit'));
  }

  render() {
    const {
      areaList,
      roomList,
      selectedList,
      other,
      submitLoading,
      selectedArea,
      selectedRoom,
      initialLoading = true,
    } = this.props;
    const { files } = this.state;
    return (
      <View>
        {initialLoading ? <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title='投诉教室' />
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
            <ListTitle title='投诉选项' />
            <AtList>
              <AtCheckbox
                options={[
                  {
                    value: 'dust',
                    label: '讲台粉尘多'
                  },
                  {
                    value: 'paper',
                    label: '讲台废纸多'
                  }
                ]}
                selectedList={selectedList}
                onChange={this.handleCheckboxChange}
              />
            </AtList>
            <ListTitle title='其他' />
            <View style={{ margin: '10px 20px' }}>
              <AtTextarea
                value={other}
                onChange={this.handleOtherChange}
                maxLength={200}
                placeholder='请填写投诉内容'
              />
            </View>
            <ListTitle title='拍照' />
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
