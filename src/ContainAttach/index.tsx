import './index.scss';
import React from 'react';
import { isPic } from '@szsk/utils/lib/regexp';
import ContainImage from '../ContainImage';
import CommonVideo from '../ContainVideo';

interface IProps {
  fileSrc: string; // 地址
  contentType: string; // 类型，video开头或者image开头的contentType
  width: string; // 容器宽度
  height: string; // 容器高度
  title: string; // 视频modal title
  outerClass?: string; // 传入的class
  picCallback?: () => void;
  videoCallback?: (dataUrl: string) => void;
  finishModeled?: number | null;
  cropEnable?: boolean;
}
const ContainAttach = (props: IProps) => {
  const {
    picCallback,
    fileSrc = '',
    contentType = '',
    outerClass,
    width = '100px',
    height = '100px',
    finishModeled = 0,
    cropEnable = false,
    videoCallback,
    title,
  } = props;
  return (
    <>
      {contentType.startsWith('image') || isPic(contentType) ? (
        <ContainImage
          picCallback={picCallback}
          imgSrc={fileSrc}
          outerClass={outerClass}
          width={width}
          height={height}
          finishModeled={finishModeled}
        />
      ) : (
        <CommonVideo
          videoCallback={(dataUrl: string = '') => {
            videoCallback && videoCallback(dataUrl);
          }}
          title={title}
          cropEnable={cropEnable}
          videoSrc={fileSrc}
          outerClass={outerClass}
          width={width}
          height={height}
        />
      )}
    </>
  );
};
export default ContainAttach;
