import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtCheckbox, AtActivityIndicator, AtButton } from 'taro-ui'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'

@connect(({ faulthanding, loading }) => ({
  ...faulthanding,
  initialLoading: loading.effects['faulthanding/getFaultClassList'],
  submitLoading: loading.effects['faulthanding/submit']
}))
export default class FaultHandingSubPage extends Component {
  config = {
    navigationBarTitleText: '故障处理'
  }

  componentDidMount() {
    this.props.dispatch(Action('faulthanding/getFaultClassList'))
  }

  handleCheckboxChange = value => this.props.dispatch(Action('faulthanding/save', {
    selectedFaultList: value
  }))

  handleSubmit = () => this.props.dispatch(Action('faulthanding/submit'))

  render() {
    const {
      initialLoading,
      submitLoading,
      selectedEquipment,
      selectedFaultList,
      faultClassList,
    } = this.props;
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
          </View>
        }
      </View>
    )
  }
}
