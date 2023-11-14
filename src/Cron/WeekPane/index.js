import { Radio } from 'antd';
import React from 'react';
import InputFromTo from './InputFromTo';
import InputLast from './InputLast';
import InputSpecified from './InputSpecified';
import InputTarget from './InputTarget';

const radioStyle = { display: 'block', lineHeight: '32px' };

function WeekPane(props) {
    const { value, onChange } = props;
    let currentRadio = 0;
    if (value === '*') {
        currentRadio = 0;
    } else if (value === '?') {
        currentRadio = 1;
    } else if (value.indexOf('-') > -1) {
        currentRadio = 2;
    } else if (value.indexOf('#') > -1) {
        currentRadio = 3;
    } else if (value.indexOf('L') > -1) {
        currentRadio = 4;
    } else {
        currentRadio = 5;
    }

    const onChangeRadio = (e) => {
        const valueType = e.target.value;
        const defaultValues = ['*', '?', 'SUN-MON', '1#MON', 'SUNL', 'SUN'];
        onChange(defaultValues[valueType]);
    };

    return (
        <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
            <Radio style={radioStyle} value={0}>
                每一周
            </Radio>
            <Radio style={radioStyle} value={1}>
                不指定
            </Radio>
            <Radio style={radioStyle} value={2}>
                <InputFromTo disabled={currentRadio !== 2} value={value} onChange={onChange} />
            </Radio>
            <Radio style={radioStyle} value={3}>
                <InputTarget disabled={currentRadio !== 3} value={value} onChange={onChange} />
            </Radio>
            <Radio style={radioStyle} value={4}>
                <InputLast disabled={currentRadio !== 4} value={value} onChange={onChange} />
            </Radio>
            <Radio style={radioStyle} value={5}>
                <InputSpecified disabled={currentRadio !== 5} value={value} onChange={onChange} />
            </Radio>
        </Radio.Group>
    );
}

export default WeekPane;
