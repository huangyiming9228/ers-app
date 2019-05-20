import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtList,
  AtActivityIndicator,
  AtDivider,
  AtListItem,
} from 'taro-ui'
import ListTitle from '../components/ListTitle'
import Action from '../../utils/action'


@connect(({ faultlist, loading }) => ({
  ...faultlist,
  initialLoading: loading.effects['faultlist/getFaultList'],
}))
export default class FaultList extends Component {
  config = {
    navigationBarTitleText: '待处理故障'
  }

  componentDidMount() {
    this.props.dispatch(Action('faultlist/getFaultList'))
  }

  handleFaultClick = item => {
    const { dispatch } = this.props;
    dispatch(Action('faultlist/save', { handingFault: item }));
    Taro.navigateTo({
      url: '../../pages/faultlist_subpage/index'
    });
  }

  render() {
    const {
      initialLoading = true,
      faultList,
    } = this.props;
    return (
      <View>
        {
          initialLoading ?
          <AtActivityIndicator mode='center' content='loading...'></AtActivityIndicator> :
          <View>
            <ListTitle title='故障列表' />
            <View>
              {
                faultList.length === 0 ?
                <AtDivider content='暂无数据' fontColor='#ccc' lineColor='#ccc' /> :
                <AtList>
                  {
                    faultList.map(item => <AtListItem
                      key={item.id}
                      title={item.equipment_info.type}
                      arrow='right'
                      extraText='处理'
                      note={`${item.area_name} - ${item.room_name}`}
                      onClick={() => this.handleFaultClick(item)}
                    />)
                  }
                </AtList>
              }
            </View>
          </View>
        }
      </View>
    )
  }
}
