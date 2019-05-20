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
    server_flag: '1',
    store_flag: '1',
    serverpower_flag: '1',
    network_flag: '1',
    air_flag: '1',
    clean_flag: '1',
  },
  temperature: '',
  comments: '',
  imageList: [],
};

export default {
  namespace: 'machine',
  state: defaultState,
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getMachineAreaList(_, { call, put }) {
      const { user_no, auth } = Taro.getStorageSync('user');
      const { data: areaList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getMachineAreaList',
        data: { user_no, auth }
      });
      yield put(Action('save', { areaList }));
    },
    *getMachineRoomList(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      })
      const { selectedArea: { id } } = yield select(state => state.machine);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getMachineRoomList',
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
      } = yield select(state => state.machine);
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
        url: 'http://localhost/ers/api/app/saveMachineCheck',
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
