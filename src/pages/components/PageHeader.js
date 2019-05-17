import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class PageHeader extends Component {
  render() {
    const { title = null } = this.props;
    return (
      <View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '25px',
            height: '100px',
            background: 'linear-gradient(#F8F8F8, #EEEEEE)'
          }}
        >
          <View
            style={{
              paddingBottom: '15px',
              borderBottom: '2px solid #6190E8',
            }}
          >
            <Text>{title}</Text>
          </View> 
        </View>
      </View>
    )
  }
}
