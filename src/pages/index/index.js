import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

@connect(({ common }) => ({
  ...common
}))
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () {
    this.props.dispatch({
      type: 'common/login',
      payload: null
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { msg } = this.props;
    return (
      <View className='index'>
        <Text>{msg}</Text>
      </View>
    )
  }
}
