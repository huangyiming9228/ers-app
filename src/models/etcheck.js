import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'

export default {
  namespace: 'etcheck',
  state: {
    areaList: [],
    roomList: [],
    selectedArea: {
      id: null,
      area_name: null,
    },
    selectedRoom:{
      id: null,
      room_name: null,
    },
    equipmentList: [],
    floatRoomList: [],
    floatSelectedArea: {
      id: null,
      area_name: null,
    },
    floatSelectedRoom:{
      id: null,
      room_name: null,
    },
    selectedEquipment: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getAreas(_, { call, put }) {
      const { user_no, auth } = Taro.getStorageSync('user');
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getAreas',
        data: { user_no, auth }
      });
      yield put(Action('save', {
        areaList: data
      }))
    },
    *getRooms(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      })
      const { user_no, auth } = Taro.getStorageSync('user');
      const { selectedArea: { id } } = yield select(state => state.etcheck);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getRooms',
        data: { user_no, id, auth }
      });
      yield put(Action('save', {
        roomList: data,
        selectedRoom: {
          id: null,
          room_name: null
        }
      }))
      Taro.hideLoading()
    },
    *getEquipments({ payload }, { call, put }) {
      const { data } = yield call(request, {
        url: 'http://localhost/ers/api/app/getEquipments',
        data: payload
      });
      yield put(Action('save', {
        equipmentList: data
      }))
    },
    *getFloatRooms(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      })
      const { user_no } = Taro.getStorageSync('user');
      const { floatSelectedArea: { id } } = yield select(state => state.etcheck);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getRooms',
        data: { user_no, id }
      });
      yield put(Action('save', {
        floatRoomList: data,
        floatSelectedRoom: {
          id: null,
          room_name: null
        }
      }))
      Taro.hideLoading()
    },
    *updateEquipmentInfo(_, { call, put, select }) {
      const { floatSelectedRoom, selectedEquipment, equipmentList } = yield select(state => state.etcheck);
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/updateEquipmentInfo',
        data: {
          et_id: selectedEquipment.id,
          room_id: floatSelectedRoom.id
        }
      });
      if (status === 'ok') {
        Taro.showToast({
          title: '修改成功！',
          icon: 'success',
        })
        const newEquipmentList = equipmentList.filter(item => item.id !== selectedEquipment.id);
        yield put(Action('save', {
          equipmentList: newEquipmentList
        }))
      } else {
        Taro.showToast({
          title: '修改失败！',
          icon: 'none',
        })
      }
    }
  }
}
