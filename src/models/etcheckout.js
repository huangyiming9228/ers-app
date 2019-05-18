import Taro from '@tarojs/taro'
import request from '../utils/request'
import Action from '../utils/action'

const defaultForm = {
  et_name: null,
  et_no: null,
  checkout_unit: null,
  checkout_name: null,
  contacts: null,
  tel: null,
  reason: null,
  checkout_date: null,
  return_date: null,
  audit_person: null,
  audit_person_no: null,
  leader: null,
  image_id: null,
}

export default {
  namespace: 'etcheckout',
  state: {
    form: defaultForm
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    getDefaultUser(state) {
      const user = Taro.getStorageSync('user');
      return {
        ...state,
        form: {
          ...state.form,
          audit_person: user.user_name,
          audit_person_no: user.user_no,
        }
      }
    }
  },
  effects: {
    *uploadImage({ payload }, { put, select }) {
      Taro.showLoading({
        title: '图片上传中...',
        mask: true
      });
      const { form } = yield select(state => state.etcheckout);
      let image_id = null;
      yield Taro.uploadFile({
        url: 'http://localhost/ers/api/base/image_upload',
        filePath: payload.path,
        name: 'image'
      }).then(res => {
        const { data } = JSON.parse(res.data);
        image_id = data;
      });
      yield put(Action('save', {
        form: {
          ...form,
          image_id
        }
      }));
      Taro.hideLoading();
    },
    *saveEtCheckout(_, { call, put, select }) {
      const { form } = yield select(state => state.etcheckout);
      const { status } = yield call(request, {
        url: 'http://localhost/ers/api/app/saveEtCheckout',
        data: form
      });
      if (status === 'ok') {
        yield put(Action('save', {
          form: defaultForm
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
