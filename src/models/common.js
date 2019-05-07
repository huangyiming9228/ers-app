import Taro from '@tarojs/taro'
import request from '../utils/request';

export default {
  namespace: 'common',
  state: {
    msg: 'hello dva'
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *login(_, { call }) {
      const data = yield call(request, {
        url: 'http://localhost/ers/api/login/login_check',
        data: {
          user_no: 'admin',
          psw: 'adminpsw'
        }
      });
      console.log(data);
    }
  },
}