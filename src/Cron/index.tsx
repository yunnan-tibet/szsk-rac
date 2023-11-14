import { Button, Input, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
// import cronParser from 'cron-parser';
import {
  dayRegex,
  hourRegex,
  minuteRegex,
  monthRegex,
  secondRegex,
  weekRegex,
  yearRegex,
} from './cron-regex';
import DayPane from './DayPane';
import HourPane from './HourPane';
import MinutePane from './MinutePane';
import MonthPane from './MonthPane';
import SecondPane from './SecondPane';
import WeekPane from './WeekPane';
import YearPane from './YearPane';
import { meaning } from './utils';

const { TabPane } = Tabs;
const tabPaneStyle = { paddingLeft: 10, paddingBottom: 8, marginTop: -10 };
const getTabTitle = (text: string) => (
  <div style={{ width: 50, textAlign: 'center' }}>{text}</div>
);

interface IProps {
  /**
   * Cron表达式，用来解析到UI
   */
  value?: string;
  /**
   * onChange
   */
  onChange?: (cronStr: string) => void;
  /**
   * 样式
   */
  style?: React.CSSProperties;
}

function Cron(props: IProps) {
  const { style, value, onChange } = props;
  const [currentTab, setCurrentTab] = useState('1');
  const [second, setSecond] = useState('*');
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [week, setWeek] = useState('?');
  const [year, setYear] = useState('*');
  const cronExpress = [second, minute, hour, day, month, week, year].join(' ');

  useEffect(() => {
    onChange && onChange(cronExpress);
  }, [cronExpress, onChange]);

  const onParse = () => {
    if (value) {
      try {
        let [
          secondVal,
          minuteValue,
          hourVal,
          dayVal,
          monthVal,
          weekVal,
          yearVal,
        ] = value.split(' ');
        secondVal = secondRegex.test(secondVal) ? secondVal : '*';
        minuteValue = minuteRegex.test(minuteValue) ? minuteValue : '*';
        hourVal = hourRegex.test(hourVal) ? hourVal : '*';
        dayVal = dayRegex.test(dayVal) ? dayVal : '*';
        monthVal = monthRegex.test(monthVal) ? monthVal : '*';
        weekVal = weekRegex.test(weekVal) ? weekVal : '?';
        weekVal = dayVal !== '?' ? '?' : weekVal;
        yearVal = yearRegex.test(yearVal) ? yearVal : '*';
        setSecond(secondVal);
        setMinute(minuteValue);
        setHour(hourVal);
        setDay(dayVal);
        setMonth(monthVal);
        setWeek(weekVal);
        setYear(yearVal);
      } catch (error) {
        setSecond('*');
        setMinute('*');
        setHour('*');
        setDay('*');
        setMonth('*');
        setWeek('?');
        setYear('*');
      }
    }
  };

  // const onReset = () => {
  //   setSecond('*');
  //   setMinute('*');
  //   setHour('*');
  //   setDay('*');
  //   setMonth('*');
  //   setWeek('?');
  //   setYear('*');
  //   if (onOk) {
  //     onOk(['*', '*', '*', '*', '*', '?', '*'].join(' '));
  //   }
  // };

  // const onGenerate = () => {
  //   if (onOk) {
  //     onOk([second, minute, hour, day, month, week, year].join(' '));
  //   }
  // };

  const onChangeDay = (v: string) => {
    setDay(v);
    if (v !== '?') {
      setWeek('?');
    }
  };

  const onChangeWeek = (v: string) => {
    setWeek(v);
    if (v !== '?') {
      setDay('?');
    }
  };

  useEffect(onParse, [value]);

  const splitExpress = [
    {
      label: '秒',
      value: second,
    },
    {
      label: '分',
      value: minute,
    },
    {
      label: '时',
      value: hour,
    },
    {
      label: '日',
      value: day,
    },
    {
      label: '月',
      value: month,
    },
    {
      label: '周',
      value: week,
    },
    {
      label: '年',
      value: year,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '2px',
        width: 600,
        ...style,
      }}
    >
      <Tabs
        tabBarGutter={0}
        animated
        destroyInactiveTabPane
        activeKey={currentTab}
        onChange={setCurrentTab}
      >
        <TabPane tab={getTabTitle('秒')} key="1" style={tabPaneStyle}>
          <SecondPane value={second} onChange={setSecond} />
        </TabPane>
        <TabPane tab={getTabTitle('分')} key="2" style={tabPaneStyle}>
          <MinutePane value={minute} onChange={setMinute} />
        </TabPane>
        <TabPane tab={getTabTitle('时')} key="3" style={tabPaneStyle}>
          <HourPane value={hour} onChange={setHour} />
        </TabPane>
        <TabPane tab={getTabTitle('日')} key="4" style={tabPaneStyle}>
          <DayPane value={day} onChange={onChangeDay} />
        </TabPane>
        <TabPane tab={getTabTitle('月')} key="5" style={tabPaneStyle}>
          <MonthPane value={month} onChange={setMonth} />
        </TabPane>
        <TabPane tab={getTabTitle('周')} key="6" style={tabPaneStyle}>
          <WeekPane value={week} onChange={onChangeWeek} />
        </TabPane>
        <TabPane tab={getTabTitle('年')} key="7" style={tabPaneStyle}>
          <YearPane value={year} onChange={setYear} />
        </TabPane>
      </Tabs>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 80,
            }}
          >
            表达式字段
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              columnGap: 10,
            }}
          >
            {splitExpress.map((item) => {
              const { label, value } = item;
              return (
                <div
                  style={{ flex: 1, minWidth: '1px', textAlign: 'center' }}
                  key={label}
                >
                  <div
                    style={{
                      color: '#fff',
                      background: '#1E9FFF',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      height: 40,
                      color: '#1E9FFF',
                      lineHeight: '40px',
                      textAlign: 'center',
                      background: '#eee',
                      overflow: 'hidden',
                    }}
                    title={value}
                  >
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 80,
            }}
          >
            Cron表达式
          </div>
          <Input
            style={{
              display: 'flex',
              flex: 1,
            }}
            value={cronExpress}
          />
        </div>
        <div
          style={{
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 80,
            }}
          >
            Cron语意
          </div>
          <div>{meaning(second, minute, hour, day, month, week, year)}</div>
        </div>
      </div>
    </div>
  );
}

export default Cron;
