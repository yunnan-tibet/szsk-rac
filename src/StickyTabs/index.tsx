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
  offsetTop?: number; // 容器距顶fixed的top距离
  headEle?: React.ReactNode; // 顶部包裹固定的元素
  tabBarExtraContent?: any; // tabs条右侧内容
  // 副作用：smooth形式下点击tab滚动，短时间内可能会导致自行滚动的tab active无效
  behavior?: 'instant' | 'smooth'; // 滚动形式1.instant 表示滚动会直接跳转到目标位置 2.smooth 平滑滚动并产生过渡效果
  // scrollContainer设置滚动的容器，默认是window
  scrollContainer?: Element;
}

export interface ITabItem {
  key: string;
  label: string | React.ReactNode;
  children?: React.ReactNode;
}

function shallowEqual(arr1: ITabItem[], arr2: ITabItem[]) {
  // 检查属性名的数量是否相同
  if (arr1.length !== arr2.length) {
    return false;
  }
  let flag = true;
  arr1.forEach((item, idx) => {
    if (item.key !== arr2[idx].key) {
      flag = false;
    }
  });

  return flag;
}

/**
 * 吸顶，滚动联动
 * 局限.如果StickyTabs元素不够高或者下面没东西了，就会导致后面的tab切不到，因为已经滚动到最底下了
 * @param props
 * @returns
 */
const StickyTabs = (props: IProps) => {
  const {
    tabL,
    headEle,
    scrollContainer,
    offsetTop = 0,
    tabBarExtraContent,
    behavior = 'instant',
  } = props;
  const sc = (scrollContainer || window) as any; // 容器

  const headRef = useRef<any>(null); // head元素
  const idleCallbackRef = useRef<any>(null);
  const childRefs = useRef<any>({}); // tabs内容元素
  const stickyComp = useRef<any>(null); // 组件元素
  const timer = useRef<any>(null);
  const [activeKey, setActiveKey] = useState<string>(); // active的tab
  const [containerResizeListener, containerSizes] = useResizeAware(); // 监听head高度变化hook，需要重新计算headH
  const [headH, setHeadH] = useState<number>(0); // 固定的head高度，相对于视口
  const [distance, setDistance] = useState<number>(0); // 当前组件距离固定容器的距离
  const [isPActive, setIsPActive] = useState<boolean>(true);
  const [tabHeads, setTabHeads] = useState<ITabItem[]>([]);

  useEffect(() => {
    const _tabHeads = tabL.map((item) => {
      const { label, key } = item;
      return { label, key };
    });
    setTabHeads(_tabHeads);

    if (!shallowEqual(_tabHeads, tabHeads)) {
      setActiveKey((_tabHeads || [])[0]?.key);
    }
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
    let scInfo;
    if (sc?.getBoundingClientRect && stickyComp.current) {
      // 获取固定的滚动父元素距离视口
      scInfo = sc.getBoundingClientRect();
    }
    const compTop = getDistanceFromTop(stickyComp.current);
    const { top: containerTop = 0 } = scInfo || {};
    extraHeight = compTop - containerTop;
    if (extraHeight !== distance) {
      setDistance(extraHeight);
    }

    if ('requestIdleCallback' in window) {
      idleCallbackRef.current = requestIdleCallback(calculateDistanceToTop);
    } else {
      idleCallbackRef.current = setTimeout(calculateDistanceToTop);
    }
  };

  // 因为顶部距离不一定是固定的，所以需要监听获取
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      idleCallbackRef.current = requestIdleCallback(calculateDistanceToTop);
    } else {
      idleCallbackRef.current = setTimeout(calculateDistanceToTop);
    }

    return () => {
      if ('requestIdleCallback' in window) {
        cancelIdleCallback(idleCallbackRef.current);
      } else {
        clearTimeout(idleCallbackRef.current);
      }
    };
  }, [distance, stickyComp, sc]);

  const getScPaddingTop = () => {
    if (!sc?.getBoundingClientRect) {
      return 0;
    }
    return +window.getComputedStyle(sc).paddingTop.replace('px', '');
  };

  const scrollCb = useCallback(() => {
    if (!isPActive) {
      return;
    }
    let _activeKey;
    // 吸顶后的顶部固定高度
    let _h = headH + offsetTop;
    if (sc?.getBoundingClientRect) {
      // 默认容器外是固定的
      const { top: containerOffsetTop = 0 } = sc?.getBoundingClientRect();
      _h = _h + containerOffsetTop + getScPaddingTop();
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
  }, [setActiveKey, childRefs.current, headH, distance, sc, isPActive]);

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
    // 元素到stickyTabs的顶部距离 + stickyTabs距离包裹容器的距离 - stickyTabs的headH（sticky） - fixed距顶距离 - 滚动容器paddingTop（sticky附着在padding下） + 1
    // + 1 是因为计算存在偏差，四舍五入导致的误差
    const scrollTop =
      childRefs.current[key].offsetTop +
      distance -
      headH -
      offsetTop +
      1 -
      getScPaddingTop();
    sc.scrollTo({
      top: scrollTop,
      behavior,
    });
    // 滚不到激活tab，需要自己行动，禁用一下position active
    setActiveKey(key);
    setIsPActive(false);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(
      () => {
        setIsPActive(true);
        timer.current = null;
      },
      behavior === 'instant' ? 500 : 1500,
    );
  };

  return (
    <div
      ref={stickyComp}
      className="m-stickyTabs"
      style={{ position: 'relative' }}
    >
      <StickyBox
        offsetTop={offsetTop}
        offsetBottom={20}
        style={{ zIndex: 1, backgroundColor: 'white' }}
      >
        <div className="m-head" ref={headRef}>
          {containerResizeListener}
          {/* <div className="u-bg" /> */}
          {headEle}
          {/* 没有设置默认会选到第一个active */}
          <Tabs
            tabBarExtraContent={tabBarExtraContent}
            activeKey={activeKey}
            onFocus={(e) => {
              e.target.blur();
            }}
            onChange={onChange}
          >
            {(tabHeads || []).map((item) => {
              const { key, label } = item;
              return <Tabs.TabPane key={key} tabKey={key} tab={label} />;
            })}
          </Tabs>
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
