import React from 'react';
import Title from '../Title';
import './index.scss';

interface IContentWrapperProps extends IBaseWrapperProps {
  // 页面内容
  children?: React.ReactNode;
  // 标题
  title?: string;
}

interface IBaseWrapperProps {
  className?: string;
}

export default function ContentWrapper(props: IContentWrapperProps) {
  const { children, title, className } = props;
  return (
    <div className={`g-wrapper ${className || ''}`}>
      {title && <Title title={title} />}
      {children}
    </div>
  );
}
