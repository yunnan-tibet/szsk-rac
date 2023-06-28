import './index.scss';
import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import useResizeAware from 'react-resize-aware';

interface IProps {
  imgSrc: string; // 图片地址
  width: string; // 容器宽度
  height: string; // 容器高度
  outerClass?: string; // 传入的class
  picCallback?: () => void; // 图片点击事件
}
const ContainImage = (props: IProps) => {
  const {
    picCallback,
    imgSrc = '',
    outerClass,
    width = '100px',
    height = '100px',
  } = props;
  const [wrapperClass, setWrapperClass] = useState('');
  const [containerResizeListener, containerSizes] = useResizeAware();

  const jugdeClass = (absW: number, absH: number) => {
    if (!absW || !absH) {
      return;
    }
    const img = new window.Image();
    img.src = imgSrc;

    img.onload = () => {
      if (!img.width || !img.height) {
        return;
      }
      if (img.width / img.height > absW / absH) {
        setWrapperClass('f-width-cover');
      } else {
        setWrapperClass('f-height-cover');
      }
    };
  };

  useEffect(() => {
    jugdeClass(containerSizes.width || 0, containerSizes.height || 0);
  }, [containerSizes]);

  return (
    <div
      className={`m-component-common-image ${outerClass || ''}`}
      style={{ width, height }}
    >
      {containerResizeListener}
      {!picCallback ? (
        <Image wrapperClassName={wrapperClass} src={imgSrc} />
      ) : (
        <div
          className={`ant-image ${wrapperClass}`}
          onClick={() => {
            picCallback();
          }}
        >
          <img className="ant-image-img" src={imgSrc} />
        </div>
      )}
    </div>
  );
};
export default ContainImage;
