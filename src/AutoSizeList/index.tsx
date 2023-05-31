import { funcUtils } from '@szsk/utils';
import React, { useEffect, useState } from 'react';
import useResizeAware from 'react-resize-aware';
import './index.scss';

/**
 * 自适应列表
 */
interface IProps {
  // 数据源
  list: any[];
  // item宽度
  itemWidth: number;
  // item拉伸方式
  type?: 'flex' | 'default';
  // 组件形式渲染，为了解决hook放到组件内，减少耦合
  CompCard?: React.FC<{ data: any; idx: number }>;
  // item渲染方式
  render?: any;
  // 两个item中间最小间距
  minSpace?: number;
}
const AutoSizeList = (props: IProps) => {
  const {
    list = [],
    render,
    itemWidth,
    minSpace = 10,
    CompCard,
    type = 'default',
  } = props;
  // space 间距px, itemNum 一行的最大个数
  const [numObj, setNumObj] = useState({ itemNum: 1, space: minSpace });
  // 监听父容器大小变化的hook
  const [containerResizeListener, containerSizes] = useResizeAware();
  const { itemNum: rowCount, space } = numObj;
  // 监听父容器宽度变化
  useEffect(() => {
    if (containerSizes.width) {
      // 容器宽度
      const cWidth = Math.floor(containerSizes.width - 1);
      // 一行的最大个数，但是因为用的是floor，所以item宽度可能缺失，间距增加，minSpace需要增加
      // 因为最后一个item是没有Space的，这里加一个minSpace互补
      const itemNum = Math.floor((cWidth + minSpace) / (itemWidth + minSpace));
      // 初始化，数量小于最大个数，margin单边限定为minSpace，防止抖动
      let mySpace = minSpace;
      if (list.length >= itemNum) {
        // 容器宽度 - item占据总宽度 / 间距个数 = 间距 px
        mySpace = Math.floor((cWidth - itemNum * itemWidth) / (itemNum - 1));
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
          const isLastLine = idx + rowCount >= list.length;
          const lastLineFull = idx + rowCount === list.length;
          return (
            <div
              className={`m-row ${isLastLine ? 'f-lastRow' : ''} ${
                lastLineFull ? 'f-full' : ''
              }`}
              key={`${idx}`}
            >
              {list.map((_item, jdx) => {
                if (jdx >= idx && jdx < idx + rowCount) {
                  const getStyle = () => {
                    if (type === 'flex') {
                      // 自适应的
                      if (jdx === idx + rowCount - 1) {
                        // 一行的最后一个？
                        return {
                          flex: `0 0 ${(1 / rowCount) * 100}%`,
                        };
                      }
                      // 非最后一个
                      return {
                        paddingRight: `${minSpace}px`,
                        flex: `0 0 ${(1 / rowCount) * 100}%`,
                      };
                    }
                    // 非自适应的，最后一行，不满的情况
                    if (isLastLine && !lastLineFull) {
                      return { marginRight: `${space}px` };
                    }
                    return {};
                  };
                  return (
                    <div
                      // 以idx作为key，会让diff认为这个节点本身一直都是没有变更的
                      key={`${idx}${jdx}`}
                      className="m-autoSpaceItem"
                      style={getStyle()}
                    >
                      {CompCard && <CompCard data={_item} idx={jdx} />}
                      {render && render(_item, jdx)}
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
