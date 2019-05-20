import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import 'taro-ui/dist/style/index.scss'
import Login from './pages/login'
import dva from './utils/dva'
import models from './models'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/etmaintain/index',
      'pages/login/index',
      'pages/etmanage/index',
      'pages/index/index',
      'pages/account/index',
      'pages/etcheck/index',
      'pages/etcheckout/index',
      'pages/foodcomplaint/index',
      'pages/faultcomplaint/index',
      'pages/faulthanding/index',
      'pages/faulthanding_subpage/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/etmanage/index',
          text: '设备管理',
          iconPath: './images/etmanage_off.png',
          selectedIconPath: './images/etmanage_on.png',
        },
        {
          pagePath: 'pages/etmaintain/index',
          text: '设备维护',
          iconPath: './images/etmaintain_off.png',
          selectedIconPath: './images/etmaintain_on.png',
        },
        // {
        //   pagePath: 'pages/account/index',
        //   text: '我的',
        //   iconPath: './images/account_off.png',
        //   selectedIconPath: './images/account_on.png',
        // },
      ],
      color: '#555',
      selectedColor: '#1890FF',
      backgroundColor: '#fff',
      borderStyle: 'black',
    },
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Login />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
