import React from 'react';
import WeekSelect from './WeekSelect';

function InputLast(props: any) {
  const { disabled, value, onChange } = props;
  let lastWeekOfMonth = 'SUN';
  if (!disabled) {
    [lastWeekOfMonth] = value.split('L');
  }
  const onChangeLastWeekOfMonth = (v: any) => onChange(`${v}L`);

  return (
    <>
      本月的最后一个&nbsp;
      <WeekSelect
        disabled={disabled}
        value={lastWeekOfMonth}
        size="small"
        onChange={onChangeLastWeekOfMonth}
        style={{ width: 100 }}
      />
      &nbsp;执行
    </>
  );
}

export default InputLast;
