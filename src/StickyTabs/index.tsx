import { Tabs } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import StickyBox from 'react-sticky-box';
import useResizeAware from 'react-resize-aware';
import './index.scss';

interface IProps {
  tabL: ITabItem[]; // tab列表
  headEle?: React.ReactNode; // 顶部包裹固定的元素
  // 若容器不为window，则传入容器元素（要求容器顶部区域为固定高度区域，不滚动！！！）
  scrollContainer?: Element;
}

export interface ITabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

/**
 * 吸顶，滚动联动
 * 局限.如果StickyTabs元素不够高或者下面没东西了，就会导致后面的tab切不到，因为已经滚动到最底下了
 * @param props
 * @returns
 */
const StickyTabs = (props: IProps) => {
  const { tabL, headEle, scrollContainer } = props;
  const sc = (scrollContainer || window) as any; // 容器
  const headRef = useRef<any>(null); // head元素
  const idleCallbackRef = useRef<any>(null);
  const childRefs = useRef<any>({}); // tabs内容元素
  const stickyComp = useRef<any>(null); // 组件元素
  const [activeKey, setActiveKey] = useState<string>(); // active的tab
  const [containerResizeListener, containerSizes] = useResizeAware(); // 监听head高度变化hook，需要重新计算headH
  const [headH, setHeadH] = useState<number>(0); // 固定的head高度，相对于视口
  const [distance, setDistance] = useState<number>(0); // 当前组件距离固定容器的距离

  // 默认选中第一个
  useEffect(() => {
    tabL && tabL.length && setActiveKey(tabL[0].key);
  }, [tabL]);

  const tabHeads = useMemo(() => {
    return tabL.map((item) => {
      const { label, key } = item;
      return { label, key };
    });
  }, [tabL]);
  useEffect(() => {
    // 获取fixed顶部元素高度，顶部元素会吸顶，滚动时需要去掉
    if (sc) {
      // head高度
      const { height } = headRef.current.getBoundingClientRect();
      setHeadH(height);
    }
  }, [headRef, containerSizes.height]);

  const getDistanceFromTop = (childElement: any) => {
    if (!childElement) return 0;

    let offsetDistance = 0;
    let currentElement = childElement;

    while (currentElement) {
      offsetDistance += currentElement.offsetTop;
      currentElement = currentElement.offsetParent;
    }

    return offsetDistance;
  };

  const calculateDistanceToTop = () => {
    // 固定的外层高度，距定位父元素高度
    let extraHeight = 0;
    if (sc?.getBoundingClientRect && stickyComp.current) {
      // 获取固定的滚动父元素距离视口
      const { top: containerTop } = sc.getBoundingClientRect();
      const compTop = getDistanceFromTop(stickyComp.current);
      extraHeight = compTop - containerTop;
    }
    if (extraHeight !== distance) {
      setDistance(extraHeight);
    }

    idleCallbackRef.current = requestIdleCallback(calculateDistanceToTop);
  };

  // 因为顶部距离不一定是固定的，所以需要监听获取
  useEffect(() => {
    idleCallbackRef.current = requestIdleCallback(calculateDistanceToTop);

    return () => {
      cancelIdleCallback(idleCallbackRef.current);
    };
  }, [distance, stickyComp, sc]);

  const scrollCb = useCallback(() => {
    let _activeKey;
    let _h = headH;
    if (sc?.getBoundingClientRect) {
      // 默认容器外是固定的
      const { top: containerOffsetTop = 0 } = sc?.getBoundingClientRect();
      _h += containerOffsetTop;
    }
    // 吸顶的时候，关注的是head高度还有固定容器距顶高度
    Object.keys(childRefs.current).forEach((key) => {
      const { bottom, height, top } =
        childRefs.current[key].getBoundingClientRect();
      // 这里以top进行比较，top是相对于视口的顶部距离
      if (top <= _h) {
        // 代表已经吸顶
        if (bottom <= height + _h && bottom >= _h) {
          // 底部小于底部边界，底部大于顶部
          _activeKey = key;
        }
      }
    });
    // 使用滚动位置来决定active
    if (_activeKey) {
      setActiveKey(_activeKey);
    }
  }, [setActiveKey, childRefs.current, headH, distance]);

  // 获取所有的tab元素
  useEffect(() => {
    Array.from(document.querySelectorAll('.J_tabPanel')).forEach((item) => {
      const key = item.getAttribute('data-key') as string;
      childRefs.current[key] = item;
    });
  }, [tabL]);

  // 滚动监听，根据滚动位置来判断active
  useEffect(() => {
    sc.addEventListener('scroll', scrollCb);

    return () => {
      sc.removeEventListener('scroll', scrollCb);
    };
  }, [scrollCb]);

  const onChange = (key: string) => {
    sc.scrollTo({
      // + 1 是因为计算存在偏差，四舍五入导致的误差
      top: childRefs.current[key].offsetTop - headH + distance + 1,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={stickyComp} className="m-stickyTabs">
      <StickyBox
        offsetTop={0}
        offsetBottom={20}
        style={{ zIndex: 1, backgroundColor: 'white' }}
      >
        <div className="m-head" ref={headRef}>
          {containerResizeListener}
          {/* <div className="u-bg" /> */}
          {headEle}
          {/* 没有设置默认会选到第一个active */}
          <Tabs activeKey={activeKey} onChange={onChange} items={tabHeads} />
        </div>
      </StickyBox>

      <div className="m-tabPanels">
        {tabL.map((item) => {
          const { children, key } = item;
          return (
            <div data-key={key} key={key} className="m-tabPanel J_tabPanel">
              {children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(StickyTabs);
