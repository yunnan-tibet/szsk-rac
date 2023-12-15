// 图片裁切的Modal

import { Modal } from 'antd';
import React, { useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import './index.scss';

interface IProps {
  pic: string; // pic url
  visible: boolean; // 控制Modal显示
  onCloseModal: () => void; // 关闭Modal回调
  onCropData: (data: any) => void; // // ok回调
}

const CropPicModal = (props: IProps) => {
  const { visible, pic, onCloseModal, onCropData } = props;
  const [cropper, setCropper] = useState<any>();
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      const data = cropper.getCroppedCanvas().toDataURL();
      onCropData(data); // 裁切的那张图片的数据
      onCloseModal();
    }
  };
  const onModalOk = () => {
    getCropData();
  };
  return (
    <Modal
      title="图片裁切"
      visible={visible}
      onOk={onModalOk}
      okText="确定"
      onCancel={() => {
        onCloseModal();
      }}
      maskClosable={false}
      width={780}
      centered
      destroyOnClose
      className="m-myInfo-modal"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'item',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <br />
          <br />
          <Cropper
            style={{ height: 400, width: '100%' }}
            zoomTo={0}
            initialAspectRatio={1}
            preview=".img-preview"
            src={pic}
            viewMode={1}
            guides
            autoCrop={false}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
        </div>
        <br style={{ clear: 'both' }} />
      </div>
    </Modal>
  );
};
export default React.memo(CropPicModal);
