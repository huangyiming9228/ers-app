import Taro from '@tarojs/taro'
import request from '../utils/request';

export default {
  namespace: 'common',
  state: {
    msg: 'hello dva',
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {

  },
}