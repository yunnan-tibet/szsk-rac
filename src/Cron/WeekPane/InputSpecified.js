import React, { useMemo } from 'react';
import { Checkbox, Row, Col } from 'antd';

const weekOptions = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function InputSpecified(props) {
    const { disabled, value, onChange } = props;
    let selected = [];
    if (!disabled) {
        selected = value.split(',');
    }
    const onChangeSelected = (v) => onChange(v.length === 0 ? 'SUN' : v.join(','));

    const checkList = useMemo(() => {
        return weekOptions.map((item) => {
            return (
                <Col key={item} span={3}>
                    <Checkbox disabled={disabled} value={item}>
                        {item}
                    </Checkbox>
                </Col>
            );
        });
    }, [disabled]);

    return (
        <React.Fragment>
            指定
            <br />
            <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={onChangeSelected}>
                <Row>{checkList}</Row>
            </Checkbox.Group>
        </React.Fragment>
    );
}

export default InputSpecified;
