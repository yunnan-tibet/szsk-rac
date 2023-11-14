import { Radio } from 'antd';
import React from 'react';
import InputFromInterval from './InputFromInterval';
import InputFromTo from './InputFromTo';
import InputSpecified from './InputSpecified';

const radioStyle = { display: 'block', lineHeight: '32px' };

function YearPane(props) {
    const { value, onChange } = props;
    let currentRadio = 0;
    if (value === '*') {
        currentRadio = 0;
    } else if (value === '?') {
        currentRadio = 1;
    } else if (value.indexOf('-') > -1) {
        currentRadio = 2;
    } else if (value.indexOf('/') > -1) {
        currentRadio = 3;
    } else {
        currentRadio = 4;
    }

    const onChangeRadio = (e) => {
        const valueType = e.target.value;
        const currentYear = new Date().getUTCFullYear();
        const defaultValues = ['*', '?', `${currentYear}-${currentYear + 10}`, `${currentYear}/1`, `${currentYear}`];
        onChange(defaultValues[valueType]);
    };

    return (
        <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
            <Radio style={radioStyle} value={0}>
                每年
            </Radio>
            <Radio style={radioStyle} value={1}>
                不指定
            </Radio>
            <Radio style={radioStyle} value={2}>
                <InputFromTo disabled={currentRadio !== 2} value={value} onChange={onChange} />
            </Radio>
            <Radio style={radioStyle} value={3}>
                <InputFromInterval disabled={currentRadio !== 3} value={value} onChange={onChange} />
            </Radio>
            <Radio style={radioStyle} value={4}>
                <InputSpecified disabled={currentRadio !== 4} value={value} onChange={onChange} />
            </Radio>
        </Radio.Group>
    );
}

export default YearPane;
