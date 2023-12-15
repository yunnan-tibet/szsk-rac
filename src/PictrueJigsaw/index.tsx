import React, { useEffect, useState } from 'react';
import ContainImage from '../ContainImage';
import './index.scss';

interface IPictureJigsawProps {
  picList: string[];
  width: string; // 目前只接受px
  height: string; // 目前只接受px
  className?: string;
}

const PictrueJigsaw: React.FC<IPictureJigsawProps> = (
  props: IPictureJigsawProps,
) => {
  const { picList = [], width, height, className } = props;
  const [itemWidth, setItemWidth] = useState(width);
  const [itemHeight, setItemHeight] = useState(height);
  const [enable, setEnable] = useState(false);

  const configItemSize = (length: number) => {
    if (!length) {
      return;
    }
    let row = 1;
    let column = 1;
    const getRowAndColumn = (l: number) => {
      if (row * column < l) {
        // 如果行列积小于pic length，那么去加行或者列
        if (row === column) {
          // 如果行等于列，那么加行
          row++;
        } else {
          // 如果行不等于列（row更大），那么加列
          column++;
        }
        getRowAndColumn(l);
      }
    };
    getRowAndColumn(length);
    // 现在拿到了row和column，来计算每个小框的大小
    setItemWidth(`${Math.floor(+width.replace('px', '') / row)}px`);
    setItemHeight(`${Math.floor(+height.replace('px', '') / column)}px`);
    setEnable(true);
  };

  useEffect(() => {
    configItemSize(picList.length);
  }, [picList.length]);

  return (
    <div style={{ width, height }} className={`m-pictureJigsaw ${className}`}>
      {enable &&
        picList.map((src: string, idx: number) => (
          <ContainImage
            key={idx}
            imgSrc={src}
            width={itemWidth}
            height={itemHeight}
          />
        ))}
    </div>
  );
};

export default React.memo(PictrueJigsaw);
