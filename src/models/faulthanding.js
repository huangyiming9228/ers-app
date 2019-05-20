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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getAreas(_, { call, put }) {
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
      const { selectedArea: { id } } = yield select(state => state.faulthanding);
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
    *submit(_, { call, put, select }) {
      const { user_no } = Taro.getStorageSync('user');
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
