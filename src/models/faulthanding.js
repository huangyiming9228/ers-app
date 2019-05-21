import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'



export default {
  namespace: 'faulthanding',
  state: {
    areaList: [],
    roomList: [],
    selectedArea: {
      area_name: '',
    },
    selectedRoom: {
      room_name: '',
    },
    equipmentList: [],
    selectedEquipment: {
      type: ''
    },
    faultClassList: [],
    selectedFaultList: [],
    userList: [],
    selectedUser: {
      user_name: '',
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getUsers(_, { call, put }) {
      const { data: userList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getUsers'
      });
      yield put(Action('save', { userList }));
    },
    *getAreas(_, { call, put }) {
      const { user_no, auth } = Taro.getStorageSync('user');
      const { data: areaList } = yield call(request, {
        url: 'http://localhost/ers/api/app/getAreas',
        data: { user_no, auth }
      });
      yield put(Action('save', { areaList }));
    },
    *getRooms(_, { call, put, select }) {
      Taro.showLoading({
        title: 'loading',
        mask: true
      });
      const { user_no, auth } = Taro.getStorageSync('user');
      const { selectedArea: { id } } = yield select(state => state.faulthanding);
      const { data = [] } = yield call(request, {
        url: 'http://localhost/ers/api/app/getRooms',
        data: { id, user_no, auth }
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
    *getEquipments({ payload }, { call, put }) {
      const { data } = yield call(request, {
        url: 'http://localhost/ers/api/app/getEquipments',
        data: payload
      });
      yield put(Action('save', {
        equipmentList: data
      }))
    },
    *getFaultClassList(_, { call, put, select }) {
      const { selectedEquipment: { class_id }} = yield select(state => state.faulthanding);
      const { data } = yield call(request, {
        url: 'http://localhost/ers/api/app/getFaultClassList',
        data: { class_id }
      });
      yield put(Action('save', {
        faultClassList: data
      }));
    },
    *submit(_, { call, select }) {
      const { user_no, user_name } = Taro.getStorageSync('user');
      const {
        selectedArea: { id: area_id },
        selectedRoom: { id: room_id },
        selectedEquipment: { id: equipment_id },
        selectedFaultList,
      } = yield select(state => state.faulthanding);
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/saveFaulthanding',
        data: {
          user_no,
          user_name,
          equipment_id,
          area_id,
          room_id,
          fault_list: selectedFaultList
        }
      });
      if (status === 'ok') {
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
    },
    *transfer(_, { call, select }) {
      const {
        user_no: transfer_no,
        user_name: transfer_name,
      } = Taro.getStorageSync('user');
      const {
        selectedArea: { id: area_id },
        selectedRoom: { id: room_id },
        selectedEquipment: { id: equipment_id },
        selectedFaultList,
        selectedUser: { user_no, user_name },
      } = yield select(state => state.faulthanding);
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/saveTechhanding',
        data: {
          user_no,
          user_name,
          transfer_no,
          transfer_name,
          equipment_id,
          area_id,
          room_id,
          fault_list: selectedFaultList
        }
      });
      if (status === 'ok') {
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
