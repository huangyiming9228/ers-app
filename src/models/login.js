import Taro from '@tarojs/taro';
import request from '../utils/request';
import Action from '../utils/action';

export default {
  namespace: 'login',
  state: {
    user_no: '',
    psw: '',
    token: '',
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *login(_, { call, select }) {
      const { user_no, psw } = yield select(state => state.login);
      const { data, message, status } = yield call(request, {
        url: 'http://localhost/ers/api/login/login_check',
        data: {
          user_no,
          psw
        },
      });
      if (status === 'ok') {
        Taro.setStorage({ key: 'user', data })
        Taro.showToast({
          title: message,
          icon: 'none',
        });
        Taro.redirectTo({
          url: '/pages/etmanage/index'
        })
      } else {
        Taro.showToast({
          title: message,
          icon: 'none',
        });
      }
      
    }
  },
}