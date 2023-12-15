import React from 'react';
import './index.scss';

interface ITitleProps {
  // 标题
  title: string;
}

function Title(props: ITitleProps) {
  const { title } = props;
  return <div className="g-title">{title}</div>;
}

export default React.memo(Title);
