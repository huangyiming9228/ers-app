import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'

const defaultState = {
  areaList: [],
  roomList: [],
  selectedArea: {
    area_name: ''
  },
  selectedRoom: {
    room_name: ''
  },
  record: {
    host_flag: '1',
    shell_flag: '1',
    power_flag: '1',
    air_flag: '1',
    clean_flag: '1',
  },
  temperature: '',
  comments: '',
  imageList: [],
};

export default {
  namespace: 'ups',
  state: defaultState,
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getUpsAreaList(_, { call, put }) {
      const { user_no, auth } = Taro.getStorageSync('user');
      const { data: areaList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getUpsAreaList',
        data: { user_no, auth }
      });
      yield put(Action('save', { areaList }));
    },
    *getUpsRoomList(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      })
      const { selectedArea: { id } } = yield select(state => state.ups);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getUpsRoomList',
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
      const { user_no, user_name } = Taro.getStorageSync('user');
      const {
        selectedArea: { id: area_id, area_name },
        selectedRoom: { id: room_id, room_name },
        record,
        temperature,
        comments,
        imageList,
      } = yield select(state => state.ups);
      const params = {
        area_id,
        area_name,
        room_id,
        room_name,
        ...record,
        temperature,
        comments,
        image_list: imageList,
        user_no,
        user_name,
      };
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/saveUpsCheck',
        data: params
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
