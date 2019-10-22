import React, { forwardRef } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

function DateSelect({ value, onChange, showTime = false, placeholder = '请选择' }, ref) {
  return (
    <DatePicker
      ref={ref}
      placeholder={placeholder}
      value={value ? moment(value) : null}
      showTime={showTime}
      onChange={(_, dateStr) => {
        onChange && onChange(dateStr || undefined);
      }}
    />
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(DateSelect);
