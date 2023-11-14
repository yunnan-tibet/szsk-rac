import { InputNumber } from 'antd';
import React from 'react';
import WeekSelect from './WeekSelect';

function InputTarget(props: any) {
  const { disabled, value, onChange } = props;
  let weekOfMonth = 1;
  let dayOfWeek = 'MON';
  if (!disabled) {
    [weekOfMonth, dayOfWeek] = value.split('#');
    weekOfMonth = parseInt(`${weekOfMonth}`, 10);
  }
  const onChangeWeekOfMonth = (v: any) => onChange(`${v || 1}#${dayOfWeek}`);
  const onChangeDayOfWeek = (v: any) =>
    onChange(`${weekOfMonth}#${v || 'MON'}`);

  return (
    <>
      本月第&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={5}
        value={weekOfMonth}
        size="small"
        onChange={onChangeWeekOfMonth}
        style={{ width: 100 }}
      />
      &nbsp;周的&nbsp;
      <WeekSelect
        disabled={disabled}
        value={dayOfWeek}
        size="small"
        onChange={onChangeDayOfWeek}
        style={{ width: 100 }}
      />
      &nbsp;执行
    </>
  );
}

export default InputTarget;
