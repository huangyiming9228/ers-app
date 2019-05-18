import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'

const defaultState = {
  areaList: [],
  roomList: [],
  selectedArea: {
    area_name: null
  },
  selectedRoom: {
    room_name: null
  },
  selectedList: [],
  other: '',
  imageList: [],
};

export default {
  namespace: 'faultcomplaint',
  state: defaultState,
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getAreaList(_, { call, put }) {
      const { data: areaList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getAllAreas',
      });
      yield put(Action('save', { areaList }));
    },
    *getRooms(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      })
      const { selectedArea: { id } } = yield select(state => state.faultcomplaint);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getAllRooms',
        data: { id }
      });
      yield put(Action('save', {
        roomList: data,
        selectedRoom: {
          id: null,
          room_name: null
        }
      }));
      Taro.hideLoading();
    },
    *submit(_, { call, put, select }) {
      const {
        selectedRoom: { id: room_id },
        selectedList,
        other,
        imageList
      } = yield select(state => state.faultcomplaint);
      const pe = selectedList.includes('pe') ? 1: 0;
      const computer = selectedList.includes('computer') ? 1: 0;
      const se = selectedList.includes('se') ? 1: 0;
      const cc = selectedList.includes('cc') ? 1: 0;
      const desk = selectedList.includes('desk') ? 1: 0;
      const power = selectedList.includes('power') ? 1: 0;
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/saveFaultcomplaint',
        data: {
          room_id,
          pe,
          computer,
          se,
          cc,
          desk,
          power,
          other,
          image_list: imageList
        }
      });
      if (status === 'ok') {
        yield put(Action('save', {
          ...defaultState
        }));
        Taro.showToast({
          title: '提交成功！',
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
