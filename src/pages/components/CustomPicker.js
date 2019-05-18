import Taro, { Component } from '@tarojs/taro'
import { Picker } from '@tarojs/components'
import { AtInput } from 'taro-ui'

export default class CustomPicker extends Component {
  render() {
    const {
      name,
      onChange,
      title,
      value,
      mode,
      range = null,
      rangeKey = null,
      start = null,
      end = null,
      placeholder = '',
    } = this.props;
    return (
      <Picker
        mode={mode}
        range={range}
        rangeKey={rangeKey}
        onChange={onChange}
        start={start}
        end={end}
      >
        <AtInput
          type='text'
          name={name}
          title={title}
          value={value}
          placeholder={placeholder}
          editable={false}
        />
      </Picker>
    )
  }
}
