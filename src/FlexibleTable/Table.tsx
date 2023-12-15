/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState } from 'react';

import { Pagination, Table, Tooltip } from 'antd';
import { TableProps } from 'antd/lib/table';
import { FlexibleTableProps } from './types';
import './index.scss';
import { remarkStyle, TABLE_CELL_PADDING_WIDTH } from './config';
import { computeCellWidthInCh } from './utils';

type FlexibleTableProp = FlexibleTableProps<any>;

const FlexibleTable: React.FC<FlexibleTableProp> = (props) => {
  const {
    defaultEmptyChar = '-',
    showPageIdx = false,
    onChange,
    pagination,
    ...restTableProps
  } = props;

  const { dataSource, columns, scroll, rowSelection } = restTableProps || {};

  const { pageSize, current } = pagination || {};

  const [pageS, setPageSize] = useState<number>(10);
  const [pageN, setPageNum] = useState<number>(1);
  const [tableFilterAndSort, setTableFilterAndSort] = useState<[any, any, any]>(
    [{}, {}, {}],
  );

  useEffect(() => {
    if (typeof pageSize === 'number') {
      setPageSize(pageSize);
    }
  }, [pageSize]);

  useEffect(() => {
    if (typeof current === 'number') {
      setPageNum(current);
    }
  }, [current]);

  const updatedTableProps: Pick<
    TableProps<any>,
    'columns' | 'scroll'
  > = useMemo(() => {
    let scrollCh = 0;
    let scrollPx = 0;
    const newColumns = columns.map((col) => {
      // 添加默认字符
      if (defaultEmptyChar) {
        const _render = col.render;

        col.render = (val, record, idx) => {
          if (_render) {
            return _render(val, record, idx) || defaultEmptyChar;
          }
          return val || defaultEmptyChar;
        };
      }

      // 设置col单元宽度
      if (col.width) {
        scrollPx += +col.width;
        if (col.tooltip) {
          if (!col.render) {
            col.render = (text: string, record: any, idx: number) => (
              <Tooltip title={text}>
                <div style={remarkStyle}>{text}</div>
              </Tooltip>
            );
          } else {
            const oldRender = col.render;
            col.render = (text: string, record: any, idx: number) => {
              const _v = oldRender(text, record, idx) as string;
              return (
                <Tooltip title={_v}>
                  <div style={remarkStyle}>{_v}</div>
                </Tooltip>
              );
            };
          }
        }
        return col;
      }
      // 没设置宽度的需要计算最大宽度，得到单位是ch
      let chWidth = computeCellWidthInCh(dataSource, col);

      chWidth += 1;
      // padding的宽度
      const extraPxWidth = TABLE_CELL_PADDING_WIDTH;

      const newCol = {
        ...col,
        width: `calc(${chWidth}ch + ${extraPxWidth}px)`,
      };
      scrollCh += chWidth;
      scrollPx += extraPxWidth;
      return newCol;
    });

    return {
      columns: newColumns,
      scroll: { ...scroll, x: `calc(${scrollCh}ch + ${scrollPx}px)` },
    };
  }, [columns, dataSource, scroll, rowSelection]);

  return (
    <div
      className="m-flexibleTable flex-full"
      style={{ justifyContent: 'space-between', maxWidth: '100%' }}
    >
      <Table
        {...restTableProps}
        {...updatedTableProps}
        onChange={(p, ...rest) => {
          setTableFilterAndSort(rest);
          onChange && onChange({ current: pageN, pageSize: pageS }, ...rest);
        }}
        pagination={false}
      />
      {pagination ? (
        <div className="m-myPagination">
          <Pagination
            showQuickJumper
            showSizeChanger
            showTotal={(t: number) => {
              const totalP = Math.ceil(t / pageS);
              const _pageN = Math.min(pageN, totalP);
              return `共${t}条${showPageIdx ? ` 第${_pageN}/${totalP}页` : ''}`;
            }}
            {...pagination}
            pageSize={pageS}
            current={pageN}
            onChange={(ct, ps) => {
              setPageSize(ps);
              setPageNum(ct);
              onChange &&
                onChange({ current: ct, pageSize: ps }, ...tableFilterAndSort);
            }}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default React.memo(FlexibleTable);
