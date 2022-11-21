import React from 'react';
import './index.scss';

interface ITitleProps {
  // 标题
  title: string;
}

export default function Title(props: ITitleProps) {
  const { title } = props;
  return <div className="g-title">{title}</div>;
}
