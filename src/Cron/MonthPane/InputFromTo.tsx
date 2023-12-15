import React from 'react';
import { InputNumber } from 'antd';

function InputFromTo(props: any) {
  const { disabled, value, onChange } = props;
  let from = 1;
  let to = 1;
  if (!disabled) {
    [from, to] = value.split('-').map((v: any) => parseInt(v, 10));
  }
  const onChangeFrom = (v: any) => onChange(`${v || 1}-${to}`);
  const onChangeTo = (v: any) => onChange(`${from}-${v || 1}`);

  return (
    <>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={12}
        value={from}
        size="small"
        onChange={onChangeFrom}
        style={{ width: 100 }}
      />
      &nbsp;-&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={12}
        value={to}
        size="small"
        onChange={onChangeTo}
        style={{ width: 100 }}
      />
      &nbsp;月，每月执行
    </>
  );
}

export default React.memo(InputFromTo);
