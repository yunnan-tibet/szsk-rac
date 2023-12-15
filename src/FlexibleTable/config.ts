import React from 'react';

export const TABLE_CELL_PADDING_WIDTH = 2 * 16; // 默认padding是16
export const CHAR_LENGTH_TO_CH = 1.8; // 1.8ch为一个中文，是比较好的比例
export const remarkStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
};
