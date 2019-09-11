import React, { forwardRef } from "react";
import { openPath } from "../../utils";
import {
  Icon,
  Button,
  Row,
  Col,
} from "antd";

function PathSelect({ value, onChange }, ref) {
  const handlePathSelect = () => {
    openPath()
      .then(res => {
        onChange && onChange(res);
      })
      .catch(err => {
        console.log(err);
        // message.error(err.message || "选择失败");
      });
  };

  return (
    <Row ref={ref}>
      <Col>
        <Row>
          <Col>
            <Button type="dashed" onClick={handlePathSelect}>
              <Icon type="select" />
              点击选择
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{value}</Col>
        </Row>
      </Col>
    </Row>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(PathSelect);
