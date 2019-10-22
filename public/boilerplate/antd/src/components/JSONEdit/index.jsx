import React, { useState, forwardRef } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

function JSONEdit({ value, onChange, placeholder = '请输入' }, ref) {
  const [errmsg, setErrmsg] = useState('');

  function handleChange(e) {
    if (onChange) {
      if (e.target.value) {
        try {
          setErrmsg('');
          onChange(JSON.parse(e.target.value));
        } catch (err) {
          console.log(err);
          setErrmsg('格式有误');
          onChange(undefined);
        }
      } else {
        setErrmsg('');
        onChange(undefined);
      }
    }
  }

  return (
    <div ref={ref}>
      <TextArea
        placeholder={placeholder}
        defaultValue={
          value === undefined || value === null ? '' : JSON.stringify(value, null, '  ')
        }
        onChange={handleChange}
        autosize
      />
      <div style={{ color: '#f5222d' }}>{errmsg}</div>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(JSONEdit);
