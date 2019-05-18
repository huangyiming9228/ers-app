import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtImagePicker, AtList, AtInput, AtTextarea, AtButton, AtMessage  } from 'taro-ui'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import ListTitle from '../components/ListTitle'
import CustomPicker from '../components/CustomPicker'

@connect(({ etcheckout, loading }) => ({
  ...etcheckout,
  submitLoading: loading.effects['etcheckout/saveEtCheckout']
}))
export default class EtCheckout extends Component {

  config = {
    navigationBarTitleText: '设备外借'
  }

  state = {
    files: [],
  }

  componentDidMount() {
    this.props.dispatch(Action('etcheckout/getDefaultUser'))
  }

  handleImageChange = (files) => {
    const {
      form,
      dispatch
    } = this.props;
    this.setState({ files });
    if (files.length === 0) {
      dispatch(Action('etcheckout/save', {
        form: {
          ...form,
          image_id: null,
        }
      }));
    } else {
      dispatch(Action('etcheckout/uploadImage', {
        path: files[0]['url']
      }));
    }
  }

  handleInputChange = (value, inputName) => {
    const { form, dispatch } = this.props;
    dispatch(Action('etcheckout/save', {
      form: {
        ...form,
        [inputName]: value
      }
    }))
  }

  handlePickerChange = (e, pickerName) => {
    const { form, dispatch } = this.props;
    dispatch(Action('etcheckout/save', {
      form: {
        ...form,
        [pickerName]: e.detail.value
      }
    }))
  }

  handleReasonChange = e => {
    const { form, dispatch } = this.props;
    dispatch(Action('etcheckout/save', {
      form: {
        ...form,
        reason: e.target.value
      }
    }))
  }

  handleSubmit = () => {
    const { form, dispatch} = this.props;
    let validator = true;
    const errorAlert = message => {
      Taro.atMessage({
        message,
        type: 'error',
        duration: 1500
      });
      validator = false;
    };
    validator && (form.et_no || errorAlert('请填写设备编码！'));
    validator && (form.et_name || errorAlert('请填写设备名称！'));
    validator && (form.checkout_unit || errorAlert('请填写外借单位！'));
    validator && (form.checkout_name || errorAlert('请填写外借人员！'));
    validator && (form.contacts || errorAlert('请填写联系人！'));
    validator && (form.tel || errorAlert('请填写电话！'));
    validator && (form.leader || errorAlert('请填写同意领导！'));
    validator && (form.reason || errorAlert('请填写外借事由！'));
    validator && (form.image_id || errorAlert('请上传设备照片！'));
    if (form.checkout_date && form.return_date) {
      if (new Date(form.checkout_date).getTime() > new Date(form.return_date).getTime()) {
        errorAlert('归还日期不能小于外借日期！');
      }
    }
    if (validator) {
      dispatch(Action('etcheckout/saveEtCheckout'))
    }
  }
  
  render() {
    const { files } = this.state;
    const {
      form: {
        et_name,
        et_no,
        checkout_unit,
        checkout_name,
        contacts,
        tel,
        reason,
        checkout_date,
        return_date,
        audit_person,
        leader,
      },
      submitLoading,
    } = this.props;
    return (
      <View>
        <ListTitle title='填写信息' />
        <AtList>
          <AtInput
            name='et_no'
            title='设备编码'
            type='text'
            value={et_no}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'et_no')}
          />
          <AtInput
            name='et_name'
            title='设备名称'
            type='text'
            value={et_name}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'et_name')}
          />
          <AtInput
            name='checkout_unit'
            title='外借单位'
            type='text'
            value={checkout_unit}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'checkout_unit')}
          />
          <AtInput
            name='checkout_name'
            title='外借人员'
            type='text'
            value={checkout_name}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'checkout_name')}
          />
          <AtInput
            name='contacts'
            title='联系人'
            type='text'
            value={contacts}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'contacts')}
          />
          <AtInput
            name='tel'
            title='电话'
            type='phone'
            value={tel}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'tel')}
          />
          <CustomPicker
            mode='date'
            name='checkout_date'
            title='外借日期'
            value={checkout_date}
            onChange={e => this.handlePickerChange(e, 'checkout_date')}
            placeholder='此项选填'
          />
          <CustomPicker
            mode='date'
            name='return_date'
            title='归还日期'
            value={return_date}
            onChange={e => this.handlePickerChange(e, 'return_date')}
            placeholder='此项选填'
          />
          <AtInput
            disabled
            name='audit_person'
            title='经办人'
            type='text'
            value={audit_person}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'audit_person')}
          />
          <AtInput
            name='leader'
            title='同意领导'
            type='text'
            value={leader}
            placeholder='必填'
            onChange={value => this.handleInputChange(value, 'leader')}
          />
        </AtList>
        <ListTitle title='外借事由' />
        <View style={{ margin: '10px 20px' }}>
          <AtTextarea
            value={reason}
            onChange={this.handleReasonChange}
            maxLength={200}
            placeholder='必填'
          />
        </View>
        <ListTitle title='设备拍照' />
        <View style={{ marginLeft: '10px' }}>
          <AtImagePicker
            files={files}
            onChange={this.handleImageChange}
            showAddBtn={files.length === 0}
            multiple={false}
          />
        </View>
        <View style={{ margin: '15px 20px' }}>
          <AtButton type='primary' loading={submitLoading} onClick={this.handleSubmit}>{submitLoading ? '提交中...' : '提交'}</AtButton>
        </View>
        <AtMessage />
      </View>
    )
  }
}
