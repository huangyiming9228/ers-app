import Taro from '@tarojs/taro';
import request from '../utils/request';
import action from '../utils/action';

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
    *login(_, { call, put, select }) {
      const { user_no, psw } = yield select(state => state.login);
      const { data, message, status } = yield call(request, {
        url: 'http://localhost/ers/api/login/login_check',
        data: {
          user_no,
          psw
        },
      });
      if (status === 'success') {
        Taro.setStorageSync('token', data.token);
        yield put(action('common/save', { token: data.token }));
        Taro.showToast({
          title: message,
          icon: 'none',
        });
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/index/index'
          })
        }, 1500);
      } else {
        Taro.showToast({
          title: message,
          icon: 'none',
        });
      }
      
    }
  },
}