import './index.scss';
import React, { useState, useRef } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import { noop } from '@szsk/utils/lib/func';

interface IProps {
  videoSrc: string; // 视频地址
  width: string; // 容器宽度
  height: string; // 容器高度
  title: string; // 视频modal title
  outerClass?: string; // 传入的class
  cropEnable?: boolean; // 是否可以截图
  videoCallback?: (dataUrl?: string) => void;
}
const ContainVideo = (props: IProps) => {
  const {
    videoSrc = '',
    outerClass,
    title,
    width = '100px',
    height = '100px',
    cropEnable,
    videoCallback = noop,
  } = props;
  const [visible, setVisible] = useState(false);
  const [videoSrcData, setVideoSrc] = useState(videoSrc);
  const [isDrag, setDrag] = useState(false); // 是否按下
  const [startPointX, setStartPointX] = useState(0); // 起始点X
  const [startPointY, setStartPointY] = useState(0); // 起始点Y
  const [moveWidth, setMoveWidth] = useState(0); // 移动后的宽
  const [moveHeight, setMoveHeight] = useState(0); // 移动后的高
  const [startCrop, setStartCrop] = useState(false);
  const [cropBase64Data, setCropBase64Data] = useState(''); // base64 数据
  const onCloseVideo = () => {
    setStartCrop(false);
    // setVideoSrc('');
    setCropBase64Data('');
    setTimeout(() => {
      setVisible(false);
    });
  };
  const VideoRef: any = useRef(undefined);
  const CanvasRectRef: any = useRef(undefined);

  const onOpenVideo = () => {
    setVideoSrc(videoSrc);
    setTimeout(() => {
      setVisible(true);
    });
  };
  const rectCanvas: any = document.getElementById('u-Rect-canvas');

  const createrRectangular = (w: number, h: number) => {
    // 画矩形框
    const ctx = rectCanvas.getContext('2d');
    // 每次先清空一下
    ctx.clearRect(0, 0, 999, 999);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;
    // 画实心矩形
    // ctx.fillRect(startPointX, startPointY, w, h);
    ctx.fillRect(0, 0, 999, 999);
    // 清掉实心 留下边框
    // ctx.clearRect(startPointX + 1, startPointY + 1, Math.abs(w) - 2, Math.abs(h) - 2)
    ctx.clearRect(startPointX, startPointY, w, h);
  };
  const onCropVideo = (leftPointX: number, leftPointY: number) => {
    const video: any = document.getElementsByClassName('u-big-video')[0];
    const canvas: any = document.createElement('canvas');
    const scaleX = video.videoWidth / VideoRef.current.clientWidth;
    const scaleY = video.videoHeight / VideoRef.current.clientHeight;

    canvas.width = moveWidth * scaleX;
    canvas.height = moveHeight * scaleY;
    const cobj = canvas.getContext('2d'); // 获取绘图环境
    cobj.drawImage(
      video,
      leftPointX * scaleX,
      leftPointY * scaleY,
      moveWidth * scaleX,
      moveHeight * scaleY,
      0,
      0,
      moveWidth * scaleX,
      moveHeight * scaleY,
    );
    const base64 = canvas.toDataURL('image/png');
    setCropBase64Data(base64);
  };
  const onMouseDown = (e: any) => {
    // 鼠标按下
    setDrag(true); // 表示按下了
    CanvasRectRef.current.width = VideoRef.current.clientWidth;
    CanvasRectRef.current.height = VideoRef.current.clientHeight;
    setStartPointX(e.nativeEvent.offsetX); // 获取按下点的X坐标
    setStartPointY(e.nativeEvent.offsetY); // 获取按下点的Y坐标
  };
  const isComeWall = (x: number, y: number) => {
    // 是否碰壁
    setDrag(false);
    const [leftPointX, leftPointY] = [
      Math.min(startPointX, x),
      Math.min(startPointY, y),
    ];
    setStartPointX(leftPointX);
    setStartPointX(leftPointY);
    onCropVideo(leftPointX, leftPointY);
  };
  const onMouseMove = (e: any) => {
    // 鼠标移动
    if (!isDrag) {
      return null;
    }

    // 是否碰壁 如果碰壁 执行一次抬起
    if (e.nativeEvent.offsetX <= 1) {
      isComeWall(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    } else if (e.nativeEvent.offsetX >= VideoRef.current.clientWidth - 5) {
      isComeWall(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    } else if (e.nativeEvent.offsetY <= 1) {
      isComeWall(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    } else if (e.nativeEvent.offsetY >= VideoRef.current.clientHeight - 5) {
      isComeWall(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }

    const movewidth = Math.abs(e.nativeEvent.offsetX - startPointX);
    const moveheight = Math.abs(e.nativeEvent.offsetY - startPointY);
    setMoveWidth(movewidth);
    setMoveHeight(moveheight);
    createrRectangular(
      e.nativeEvent.offsetX - startPointX,
      e.nativeEvent.offsetY - startPointY,
    ); // 画矩形
  };
  const onMouseUp = (e: any) => {
    // 鼠标抬起
    setDrag(false);
    if (
      e.nativeEvent.offsetX === startPointY ||
      e.nativeEvent.offsetY === startPointY
    ) {
      return null;
    }
    // 计算左上角的点
    // 一定是最小的那个向量
    const [leftPointX, leftPointY] = [
      Math.min(startPointX, e.nativeEvent.offsetX),
      Math.min(startPointY, e.nativeEvent.offsetY),
    ];
    setStartPointX(leftPointX);
    setStartPointX(leftPointY);
    onCropVideo(leftPointX, leftPointY);
  };

  const renderCrop = () => (
    <>
      <div
        className="m-Rect-box"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <canvas ref={CanvasRectRef as any} id="u-Rect-canvas" />
      </div>
    </>
  );
  const onStartCrop = () => {
    // 开始截图
    VideoRef.current.pause();
    setStartCrop(true);
  };
  const onModalOk = () => {
    if (!cropBase64Data) {
      message.error('请先从视频中裁切一张图片', 1);
      return;
    }
    videoCallback(cropBase64Data);
    setTimeout(() => {
      onCloseVideo();
    });
  };
  const onCancelCrop = () => {
    setStartCrop(false);
    setCropBase64Data('');
    VideoRef.current.play();
  };
  const renderFooter = () => (
    <div className="m-cropVideo-footer">
      {!startCrop ? (
        <>
          <Button type="ghost" onClick={onCloseVideo}>
            关闭
          </Button>
          <Button type="primary" onClick={onStartCrop}>
            开始截图
          </Button>
        </>
      ) : (
        <>
          <Button type="ghost" onClick={onCancelCrop}>
            取消
          </Button>
          <Button type="primary" onClick={onModalOk}>
            确定
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`m-component-common-video ${outerClass}`}
        style={{ width, height }}
        // onClick={(e) => {
        //   e.stopPropagation();
        //   videoCallback();
        // }}
      >
        <video src={videoSrc} />
        <PlayCircleOutlined
          className="u-play-btn"
          style={{ fontSize: '26px' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenVideo();
          }}
        />
      </div>
      <Modal
        title={title}
        className="m-video-modal"
        bodyStyle={{ padding: 0 }}
        width={900}
        centered
        footer={cropEnable ? renderFooter() : null}
        visible={visible}
        onCancel={() => onCloseVideo()}
        maskClosable={false}
        destroyOnClose
        // onOk={onModalOk}
      >
        <div className="m-video-box">
          <video
            src={videoSrcData}
            autoPlay
            controls
            className="u-big-video"
            crossOrigin="anonymous"
            ref={VideoRef}
          >
            您的浏览器不支持video标签，请使用google浏览器浏览
          </video>
          {startCrop && renderCrop()}
        </div>
      </Modal>
    </>
  );
};
export default ContainVideo;
