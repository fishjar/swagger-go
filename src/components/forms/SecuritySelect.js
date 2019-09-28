import React, { forwardRef } from "react";
import { Checkbox } from "antd";
const CheckboxGroup = Checkbox.Group;

function SecuritySelect(
  { value = [], onChange, securityDefinitions = {} },
  ref
) {
  const handleChange = items => {
    if (onChange) {
      onChange(items.map(item => ({ [item]: [] })));
    }
  };

  return (
    <CheckboxGroup
      ref={ref}
      value={value.map(item => Object.keys(item)[0])}
      options={Object.keys(securityDefinitions)}
      onChange={handleChange}
    />
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(SecuritySelect);
