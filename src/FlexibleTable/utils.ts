import { CHAR_LENGTH_TO_CH } from './config';
import { FlexibleColumnProps, FlexibleTableProps } from './types';

export function result(obj: any, path: any) {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  const pathArray = Array.isArray(path) ? path : path.split('.');
  let currentObj = obj;

  for (const key of pathArray) {
    if (typeof currentObj[key] === 'function') {
      return currentObj[key]();
    }
    if (currentObj[key] === undefined) {
      return null;
    }

    currentObj = currentObj[key];
  }

  return currentObj;
}

export function computeCellWidthInCh(
  dataSource: FlexibleTableProps<any>['dataSource'],
  columnProps: Pick<FlexibleColumnProps<any>, 'title' | 'dataIndex' | 'render'>,
): number {
  const { title, dataIndex, render } = columnProps;
  const initialWidth =
    typeof title === 'string' ? title.length * CHAR_LENGTH_TO_CH : 0;
  if (!dataIndex || !Array.isArray(dataSource)) {
    return initialWidth;
  }
  const maxWidth = dataSource?.reduce((currentMaxWidth, dataItem, idx) => {
    // 先拿到dataIndex值
    let currentCellValue = result(dataItem, dataIndex);
    if (render) {
      // 拿到render值
      const renderResult = render(currentCellValue, dataItem, idx);
      if (typeof renderResult === 'string') {
        currentCellValue = renderResult;
      }
    }
    // 值是空的则最大的就用之前最大的
    if (currentCellValue === undefined || currentCellValue === null) {
      return currentMaxWidth;
    }
    let length = 0;
    const restCellValue = currentCellValue
      .toString()
      // 获取中文的个数
      // eslint-disable-next-line no-control-regex
      .replace(/[^\u0000-\u00ff]/g, function (substring: any) {
        length += substring.length;
        return '';
      });

    let width = length * CHAR_LENGTH_TO_CH + restCellValue.length;
    width = Math.max(width, currentMaxWidth);
    return width;
  }, initialWidth);

  return maxWidth;
}
