import { funcUtils } from '@szsk/utils';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';
import './index.scss';

interface IProps {
  // 数据源
  list: any[];
  // item渲染方式
  render: (item: any, index?: number) => JSX.Element;
  // item宽度
  itemWidth: number;
  // 两个item中间最小间距
  minSpace?: number;
}
const AutoSizeList = (props: IProps) => {
  const { list = [], render, itemWidth, minSpace = 10 } = props;
  // space 间距px, itemNum 一行的最大个数
  const [numObj, setNumObj] = useState({ itemNum: 1, space: minSpace });
  // 监听父容器大小变化的hook
  const [containerResizeListener, containerSizes] = useResizeAware();
  const { itemNum: rowCount, space } = numObj;
  const halfSpace = space / 2;

  // 监听父容器宽度变化
  useEffect(() => {
    if (containerSizes.width) {
      const cWidth = Math.floor(containerSizes.width - 1);
      // 一行的最大个数，但是因为用的是floor，所以item宽度可能缺失，间距增加，minSpace需要增加
      const itemNum = Math.floor(cWidth / (itemWidth + minSpace));
      // 初始化，数量小于最大个数，margin单边限定为minSpace，防止抖动
      let mySpace = minSpace;
      if (list.length >= itemNum) {
        // 容器宽度 - item占据总宽度 / 间距个数 = 间距 px
        mySpace = Math.floor((cWidth - itemNum * itemWidth) / itemNum);
      }
      setNumObj({ itemNum, space: mySpace });
    }
  }, [containerSizes.width, list, itemWidth, minSpace]);

  return (
    <div className="g-autoSizeList">
      {containerResizeListener}
      {list.map((item, idx) => {
        // 用于到达最大个数换行
        if (idx % rowCount === 0) {
          return (
            <div className="m-row" key={`${idx}`}>
              {list.map((_item, jdx) => {
                if (jdx >= idx && jdx < idx + rowCount) {
                  return (
                    <div
                      key={`${idx}${jdx}`}
                      className="m-autoSpaceItem"
                      style={{ margin: `0 ${halfSpace}px 0 ${halfSpace}px` }}
                    >
                      {render(_item, jdx)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default AutoSizeList;
