import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Button } from 'antd';
import { objUtils } from '@szsk/utils';
import SForm, { ISFormProps } from '../Form';
import './index.scss';

interface ISSearch extends ISFormProps {
  // 搜索回调
  onSearch: (params: any) => any;
}

// forwardRef的意义需要探究一下 todo
const SSearch = forwardRef((props: ISSearch, ref) => {
  const { onSearch, formItems, columns = 4 } = props;
  const formRef = useRef<any>(null);

  // 搜索
  const search: () => void = () => {
    formRef.current!.validateFields().then((values: any) => {
      if (onSearch) {
        // objUtils.removeNull(values);
        onSearch(values);
      }
    });
  };

  // 这里似乎没用
  useImperativeHandle(ref, () => ({
    form: formRef,
  }));

  // 重置
  const reset: () => void = () => {
    formRef.current!.resetFields();
    search();
  };
  return (
    <div className="g-search">
      <SForm ref={formRef} formItems={formItems} columns={columns} />
      {/* 这里没有适配一行放满的情况 ${
          formItems.length % columns === 0 ? styles.fNewLine : ''
        } */}
      <div className="m-btns">
        <Button onClick={() => reset()}>重置</Button>
        <Button
          onClick={() => {
            search();
          }}
          type="primary"
          className="u-search-btn"
        >
          查询
        </Button>
      </div>
    </div>
  );
});

export default React.memo(SSearch);
