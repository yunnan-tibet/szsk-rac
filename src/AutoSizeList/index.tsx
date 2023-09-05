import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
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
  // 组件形式渲染，为了解决hook放到组件内，减少耦合
  CompCard?: React.FC<{ data: any; idx: number }>;
  // item渲染方式，jsx形式，为了兼容之前的版本，后面将废弃
  render?: any;
  // 两个item中间最小间距
  minSpace?: number;
}

export interface IAutoSizeListRef {
  getRowCount: () => number;
}
const AutoSizeList = forwardRef<IAutoSizeListRef, IProps>((props, ref) => {
  const { list = [], render, itemWidth, minSpace = 10, CompCard } = props;
  // space 间距px, itemNum 一行的最大个数
  const [numObj, setNumObj] = useState({ itemNum: 1 });
  // 监听父容器大小变化的hook
  const [containerResizeListener, containerSizes] = useResizeAware();
  // 这里计算了一行最大高度
  const { itemNum: rowCount } = numObj;

  useImperativeHandle(ref, () => ({
    getRowCount: () => {
      return rowCount || 0;
    },
  }));

  // 监听父容器宽度变化
  useEffect(() => {
    if (containerSizes.width) {
      // 容器宽度
      const cWidth = Math.floor(containerSizes.width - 1);
      // 一行的最大个数，但是因为用的是floor，所以item宽度可能缺失，间距增加，minSpace需要增加
      // 因为最后一个item是没有Space的，这里加一个minSpace互补
      const itemNum = Math.floor((cWidth + minSpace) / (itemWidth + minSpace));
      // 初始化，数量小于最大个数，margin单边限定为minSpace，防止抖动
      setNumObj({ itemNum });
    }
  }, [containerSizes.width, list, itemWidth, minSpace]);

  return (
    <div className="g-autoSizeList">
      {containerResizeListener}
      {list.map((item, idx) => {
        // 用于到达最大个数换行
        if (idx % rowCount === 0) {
          return (
            <div
              className="m-row"
              style={{
                gridTemplateColumns: `repeat(${rowCount}, minmax(0, 1fr))`,
                columnGap: `${minSpace}px`,
              }}
              key={`${idx}`}
            >
              {list.map((_item, jdx) => {
                if (jdx >= idx && jdx < idx + rowCount) {
                  return (
                    <div
                      // 以idx作为key，会让diff认为这个节点本身一直都是没有变更的
                      key={`${idx}${jdx}`}
                      className="m-autoSpaceItem"
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
});

export default AutoSizeList;
