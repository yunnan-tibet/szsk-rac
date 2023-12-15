import React, { forwardRef } from 'react';
import { Form, Row, Col, FormProps } from 'antd';
import { IFormItem } from './type';
import getItemComponent from './itemTypes';

export interface ISFormProps extends FormProps {
  // 配置项列表
  formItems: IFormItem[];
  // 列数，默认4，只有可被24整除的才可以，不然会有问题
  columns?: number;
}

const SForm = forwardRef((props: ISFormProps, ref: any) => {
  const { formItems, columns = 4, ...resProps } = props;
  const getFields = () => {
    const { layout } = resProps;
    return formItems.map((item: IFormItem, idx: number) => {
      const { label, id, type, rules, initialValue, render } = item;
      // 因为两个input间需要间隔，设置每行第一个和最后一个特殊化padding
      const padding =
        idx % columns === 0
          ? '0 24px 0 0'
          : idx % columns === columns - 1
          ? '0 0 0 24px'
          : '0 24px';
      let span = 24 / columns;
      // 对五个的情况做特殊处理，7就不处理了
      if (columns === 5) {
        if (idx % columns === columns - 1) {
          span = 4;
        } else {
          span = 5;
        }
      }
      return layout === 'inline' ? (
        <Form.Item
          rules={rules}
          initialValue={initialValue}
          label={label}
          name={id}
        >
          {type ? getItemComponent(type)(item as any) : render()}
        </Form.Item>
      ) : (
        <Col style={{ padding }} key={id} span={span}>
          <Form.Item
            rules={rules}
            initialValue={initialValue}
            label={label}
            name={id}
          >
            {type ? getItemComponent(type)(item as any) : render()}
          </Form.Item>
        </Col>
      );
    });
  };

  return (
    <Form {...resProps} ref={ref}>
      <Row>{getFields()}</Row>
    </Form>
  );
});

export default React.memo(SForm);
