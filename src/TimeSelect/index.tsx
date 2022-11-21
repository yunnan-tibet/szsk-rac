import React, { useState } from 'react';
import { DatePicker, Radio } from 'antd';
import { CheckboxOptionType } from 'antd/lib/checkbox';
import './index.scss';

const { RangePicker } = DatePicker;

interface ITimeSelect {
  value?: IMoniteTime;
  onChange?: (a: any) => any;
}

interface IMoniteTime {
  timeDimension?: 0 | 1 | 2 | 3 | 4;
  startTime?: string;
  endTime?: string;
}

export default function TimeSelect(props: ITimeSelect) {
  const { onChange, value } = props;

  const [date, setDate] = useState<any>([]);
  const [type, setType] = useState<number>(1);

  const options: CheckboxOptionType[] = [
    {
      label: '近24小时',
      value: 1,
    },
    {
      label: '近一周',
      value: 2,
    },
    {
      label: '近一月',
      value: 3,
    },
    {
      label: '近一年',
      value: 4,
    },
  ];

  const onDateChanged = (e: any) => {
    setType(0);
    setDate(e);
    onChange && onChange({ startTime: e[0], endTime: e[1], timeDimension: 0 });
  };

  const onTypeChanged = (e: any) => {
    const v = e.target.value;
    setDate([]);
    setType(v);
    onChange && onChange({ timeDimension: v, startTime: '', endTime: '' });
  };

  return (
    <div className="g-timeSelect">
      <RangePicker value={date} onChange={onDateChanged} />
      <Radio.Group
        value={type}
        className="m-radioGroup"
        onChange={onTypeChanged}
        options={options}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  );
}
