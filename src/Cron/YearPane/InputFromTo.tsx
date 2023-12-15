import React from 'react';
import { InputNumber } from 'antd';

function InputFromTo(props: any) {
  const { disabled, value, onChange } = props;
  const currentYear = new Date().getUTCFullYear();
  let from = currentYear;
  let to = currentYear + 10;
  if (!disabled) {
    [from, to] = value.split('-').map((v: any) => parseInt(v, 10));
  }
  const onChangeFrom = (v: any) => onChange(`${v || currentYear}-${to}`);
  const onChangeTo = (v: any) => onChange(`${from}-${v || currentYear + 10}`);

  return (
    <>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={9999}
        value={from}
        size="small"
        onChange={onChangeFrom}
        style={{ width: 100 }}
      />
      &nbsp;-&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={9999}
        value={to}
        size="small"
        onChange={onChangeTo}
        style={{ width: 100 }}
      />
      &nbsp;年，每年执行
    </>
  );
}

export default React.memo(InputFromTo);
