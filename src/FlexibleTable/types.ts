import { TableProps, ColumnProps } from 'antd/lib/table';

export interface FlexibleColumnProps<T> extends ColumnProps<T> {
  ellipsis?: boolean;
  tooltip?: boolean;
}

export interface FlexibleTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: FlexibleColumnProps<T>[];
  showPageIdx?: boolean; // 是否展示 1/10
  defaultEmptyChar?: string;
}
