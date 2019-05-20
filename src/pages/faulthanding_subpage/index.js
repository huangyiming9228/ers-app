import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtCheckbox, AtActivityIndicator, AtButton, AtFloatLayout, AtMessage  } from 'taro-ui'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'
import CustomPicker from '../components/CustomPicker'

@connect(({ faulthanding, loading }) => ({
  ...faulthanding,
  initialLoading: loading.effects['faulthanding/getFaultClassList'],
  submitLoading: loading.effects['faulthanding/submit'],
  transferLoading: loading.effects['faulthanding/transfer'],
}))
export default class FaultHandingSubPage extends Component {
  config = {
    navigationBarTitleText: '故障处理'
  }

  state = {
    floatOpened: false,
  }

  componentDidMount() {
    this.props.dispatch(Action('faulthanding/getFaultClassList'))
  }

  handleCheckboxChange = value => this.props.dispatch(Action('faulthanding/save', {
    selectedFaultList: value
  }))

  handleSubmit = () => {
    const {
      selectedFaultList,
      dispatch
    } = this.props;
    if (selectedFaultList.length === 0) {
      Taro.atMessage({
        message: '请选择故障点！',
        type: 'error',
        duration: 1500
      });
    } else {
      dispatch(Action('faulthanding/submit'))
    }
  }

  handleTransferClick = () => this.setState({ floatOpened: true })

  handleFloatClose = () => this.setState({ floatOpened: false })

  handleUserChange = e => {
    const { userList, dispatch } = this.props;
    dispatch(Action('faulthanding/save', {
      selectedUser: userList[e.detail.value]
    }))
  }

  handleTransfer = () => {
    const {
      selectedFaultList,
      selectedUser,
      dispatch
    } = this.props;
    if (selectedFaultList.length === 0) {
      Taro.atMessage({
        message: '请选择故障点！',
        type: 'error',
        duration: 1500
      });
      return;
    }
    if (!selectedUser.user_no) {
      Taro.atMessage({
        message: '请选择技术人员！',
        type: 'error',
        duration: 1500
      });
      return;
    }
    dispatch(Action('faulthanding/transfer'))
  }

  render() {
    const {
      initialLoading,
      submitLoading,
      transferLoading,
      selectedEquipment,
      selectedFaultList,
      faultClassList,
      userList,
      selectedUser,
    } = this.props;
    const { floatOpened } = this.state;
    const checkboxOptions = faultClassList.map(item => ({ value: item.id, label: item.fault_name }));
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title={`故障选项 - ${selectedEquipment.type}`} />
            <AtList>
              <AtCheckbox
                options={checkboxOptions}
                selectedList={selectedFaultList}
                onChange={this.handleCheckboxChange}
              />
            </AtList>
            <View style={{ margin: '15px 20px' }}>
              <AtButton type='primary' loading={submitLoading} onClick={this.handleSubmit}>{submitLoading ? '提交中...' : '已处理'}</AtButton>
            </View>
            <View style={{ margin: '15px 20px' }}>
              <AtButton type='primary' onClick={this.handleTransferClick}>报技术人员</AtButton>
            </View>
          </View>
        }
        <AtFloatLayout
          isOpened={floatOpened}
          title='选择技术人员'
          onClose={this.handleFloatClose}
        >
          <AtList>
            <CustomPicker
              mode='selector'
              name='selectedArea'
              range={userList}
              rangeKey='user_name'
              title='技术人员'
              value={selectedUser.user_name}
              onChange={this.handleUserChange}
            />
          </AtList>
          <View style={{ margin: '15px 20px' }}>
            <AtButton type='primary' loading={transferLoading} onClick={this.handleTransfer}>{transferLoading ? '提交中...' : '提交'}</AtButton>
          </View>
        </AtFloatLayout>
        <AtMessage />
      </View>
    )
  }
}
