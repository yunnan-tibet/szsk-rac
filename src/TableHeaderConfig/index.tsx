import { HolderOutlined, SettingOutlined } from '@ant-design/icons';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Popover, Switch } from 'antd';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import './index.scss';
import { ColumnType } from 'antd/es/table';

export interface IHeaderColumnProps extends ColumnType<any> {
  key: string; // key
  title: any; // 标题
  isHide?: boolean; // 隐藏
  disableDrag?: boolean; // 禁止拖动
  disable?: boolean; // 禁止改变显隐
}

interface IProps {
  // table原始表头
  columns: IHeaderColumnProps[];
  // 本地持久化key
  persistKey: string;
  // 用于父级刷新
  onFresh: (columns: IHeaderColumnProps[]) => any;
  // 附着元素
  children?: React.ReactElement;
}

export interface ITHCMethods {
  // 获取最终表头
  getColumns: () => IHeaderColumnProps[];
}
/**
 * 表头配置组件，使用sessionStorage会话型存储，可配置隐藏，禁止拖动，禁止改变显隐等
 */
const TableHeaderConfig = forwardRef<ITHCMethods, IProps>((props, ref) => {
  const { columns = [], persistKey, onFresh, children } = props;
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const getConfig = () => {
    return JSON.parse(sessionStorage.getItem('tableHeaderConfig') || '{}');
  };

  const getNowColumns = useCallback(() => {
    const config = getConfig();
    const nowKeys: IHeaderColumnProps[] = config[persistKey] || columns || [];
    return nowKeys
      ?.map((item) => {
        const { key } = item;
        const target = columns?.find((item1) => item1.key === key);
        if (target) {
          return { ...target, ...item };
        }
        return null;
      })
      .filter((item) => item);
  }, [refreshFlag, persistKey, columns]);

  const nowColumns = getNowColumns();

  useImperativeHandle(
    ref,
    () => ({
      getColumns() {
        return getNowColumns().filter(
          (item) => !item?.isHide,
        ) as IHeaderColumnProps[];
      },
    }),
    [getNowColumns],
  );

  const onDisable = (checked: boolean, key: string) => {
    const _l = nowColumns.map((item) => {
      if (item?.key === key) {
        return { ...item, isHide: checked };
      }
      return { ...item };
    });
    onInnerChange(_l);
  };

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (
      nowColumns[oldIndex]?.disableDrag ||
      nowColumns[newIndex]?.disableDrag
    ) {
      return;
    }
    if (oldIndex !== newIndex) {
      const changedColumns = arrayMove(nowColumns || [], oldIndex, newIndex);
      onInnerChange(changedColumns);
    }
  };

  const onInnerChange = (changedColumns: any[]) => {
    const persistColumns = changedColumns?.map((item: any) => ({
      key: item.key,
      isHide: item.isHide,
      disableDrag: item.disableDrag,
      disable: item.disable,
    }));
    const actualColumns = changedColumns.filter((item) => !item?.isHide);
    const config = getConfig();
    config[persistKey] = persistColumns;
    sessionStorage.setItem('tableHeaderConfig', JSON.stringify(config));
    setRefreshFlag(refreshFlag + 1);
    onFresh && onFresh(actualColumns as any);
  };

  // 可拖拽的元素，避免点到一些操作元素
  const DragHandle = SortableHandle<any>(({ item }: any) => {
    const { title, isHide, disable, disableDrag, key } = item;
    return (
      <div className="m-sortable-item">
        <div className="m-sortable-item-left">
          <HolderOutlined
            style={{
              fontSize: 16,
              marginRight: 8,
              cursor: disableDrag ? 'not-allowed' : 'pointer',
              color: disableDrag ? '#C0C6CC' : undefined,
            }}
          />
          <div className="m-sortable-item-left-name">{title}</div>
        </div>
        <Switch
          onChange={(v) => onDisable(!v, key)}
          disabled={disable}
          checked={!isHide}
        />
      </div>
    );
  });

  // 拖拽的项
  const SortableItem = SortableElement<any>(({ item }: any) => {
    const { key } = item;
    return (
      <div
        className="m-sortableItem"
        style={{ zIndex: 100000, cursor: 'pointer' }}
        key={key}
      >
        <DragHandle item={item} />
      </div>
    );
  });

  // 容器
  const SortableContainerHoc = SortableContainer(
    ({ columns: _columns }: any) => (
      <div className="m-dragContainer">
        {(_columns || []).map((item: any, idx: number) => {
          const { key } = item;
          return <SortableItem key={key} index={idx} item={item} />;
        })}
      </div>
    ),
  );

  const DraggableContainer = (containerProps: any) => (
    <SortableContainerHoc
      useDragHandle
      onSortEnd={onSortEnd}
      axis="xy"
      {...containerProps}
    />
  );

  const content = (
    <div className="m-myPop">
      <div className="m-myPop-header">
        <div className="m-myPop-header-tit">表头设置</div>
      </div>
      <div className="m-myPop-cont">
        <DraggableContainer columns={nowColumns} />
      </div>
    </div>
  );

  return (
    <div className="m-tableHeaderConfig">
      <Popover
        overlayClassName="m-myPopover"
        content={content}
        placement="bottomRight"
        trigger="click"
      >
        {children || <SettingOutlined style={{ fontSize: 20 }} />}
      </Popover>
    </div>
  );
});

export default React.memo(TableHeaderConfig);
