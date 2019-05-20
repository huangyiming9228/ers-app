import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'

export default {
  namespace: 'faultlist',
  state: {
    faultList: [],
    handingFault: {
      fault_list: []
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getFaultList(_, { call, put }) {
      const { user_no, auth } = Taro.getStorageSync('user');
      const { data: faultList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getFaultList',
        data: { user_no, auth }
      });
      yield put(Action('save', { faultList }));
    },
    *submit(_, { call, put, select }) {
      const { faultList, handingFault: { id } } = yield select(state => state.faultlist);
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/updateTechhanding',
        data: { id }
      });
      if (status === 'ok') {
        const newFaultList = faultList.filter(item => item.id !== id);
        yield put(Action('save', { faultList: newFaultList }));
        Taro.showToast({
          title: '保存成功！',
          icon: 'success',
          mask: true
        });
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500);
      } else {
        Taro.showToast({
          title: '服务器错误，提交失败！',
          icon: 'none',
          mask: true
        });
      }
    }
  }
}
