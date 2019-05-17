import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class ListTitle extends Component {
  render() {
    const { title = null } = this.props;
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '10px',
          marginBottom: '10px',
          marginLeft: '10px',
          borderLeft: '2px solid #6190E8',
          height: '20px',
        }}
      >
        <Text
          style={{
            marginLeft: '15px',
            fontSize: '15px',
          }}
        >{title}</Text>
      </View>
    )
  }
}
