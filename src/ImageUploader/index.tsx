import React from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/es/upload/interface';
import { UploadFile } from 'antd/lib/upload/interface';

export interface IUploderProps extends UploadProps {
  onChange?: any;
  value?: UploadFile[];
  limit?: number;
  action?: string;
}

const ImageUploader = (props: IUploderProps) => {
  const { onChange, value = [], limit = 1, action, ...res } = props;
  const handleChange = ({ fileList }: any) => {
    onChange(
      fileList.map((item: any) => {
        return {
          ...item,
          url: item?.url || item?.response?.data[0]?.attachPath || '',
        };
      }),
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        fileList={value}
        onChange={handleChange}
        action={action}
        accept=".jpg, .jpeg, .png"
        {...res}
      >
        {value.length >= limit ? null : uploadButton}
      </Upload>
    </>
  );
};

export default ImageUploader;
