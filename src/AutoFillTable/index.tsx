import React from 'react';

import { TableProps } from 'antd/lib/table';
import './index.scss';

const TABLE_SKIP_HEIGHT = 94 + 4; // fontSize从12 -> 14，加了4

interface AutoFillTableProps {
  skipHeight: number; // 除去滚动区域的其它高度
  className?: string;
  style?: React.CSSProperties;
  children?: any;
}

interface AutoFillTableStates {
  tableHeight: number;
}

class AutoFillTable extends React.PureComponent<
  AutoFillTableProps,
  AutoFillTableStates
> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: Partial<AutoFillTableProps> = {
    // eslint-disable-next-line react/default-props-match-prop-types
    skipHeight: TABLE_SKIP_HEIGHT,
  };

  private refTableWrapper = React.createRef<HTMLDivElement>();

  constructor(props: AutoFillTableProps) {
    super(props);
    this.state = { tableHeight: 0 };
  }

  public componentDidMount() {
    const { skipHeight } = this.props;

    this.setState({
      tableHeight: this.refTableWrapper.current!.clientHeight - skipHeight,
    });
    window.addEventListener('resize', this.resizeWindow, false);
  }

  public componentDidUpdate(
    prevProps: AutoFillTableProps,
    prevState: AutoFillTableStates,
  ) {
    const { skipHeight } = this.props;

    const tableHeight = this.refTableWrapper.current!.clientHeight - skipHeight;
    if (prevState.tableHeight !== tableHeight) this.setState({ tableHeight });
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow, false);
  }

  private resizeWindow = () => {
    const { tableHeight: lastTableH } = this.state;
    const { skipHeight } = this.props;

    const tableHeight = this.refTableWrapper.current!.clientHeight - skipHeight;
    if (tableHeight !== lastTableH) {
      this.setState({ tableHeight });
    }
  };

  render() {
    const { children, style = {}, className } = this.props;
    const { tableHeight } = this.state;
    const tableElem = React.Children.toArray(children) as React.ReactElement[];

    const tableProps: Pick<TableProps<any>, 'scroll'> = {
      scroll: {
        ...tableElem[0].props.scroll,
        y: tableHeight,
      },
    };

    return (
      <div
        ref={this.refTableWrapper}
        style={style}
        className={`${className} flex-full`}
      >
        {React.cloneElement(tableElem[0], tableProps)}
      </div>
    );
  }
}

export default React.memo(AutoFillTable);
