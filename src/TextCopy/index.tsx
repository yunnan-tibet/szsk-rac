import React from 'react';
import { Tooltip, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './index.scss';

interface IProps {
  // 待复制文字
  text: string;
  // 复制成功回调
  onCopy?: (text: string, result: boolean) => void;
}

const TextCopy = (props: IProps) => {
  const { text, onCopy } = props;

  const renderTooltipCopy = () => (
    <>
      {text}
      <CopyToClipboard
        text={text}
        onCopy={(t: string, result) => {
          message.success('复制成功');
          onCopy && onCopy(t, result);
        }}
      >
        <span className="m-copy">复制</span>
      </CopyToClipboard>
    </>
  );

  return (
    <Tooltip className="m-title" placement="bottom" title={renderTooltipCopy()}>
      <span>{text}</span>
    </Tooltip>
  );
};

export default TextCopy;
