# 使用
`npm install @szsk/rac`

## 使用范围
antd组件的补充，react后台管理

## 线上文档地址
http://111.0.123.139:43001/szsk-doc/#/

## 组件类型
### 较常用型
#### Form
这是一个表单组件，完全配置化，减少繁杂代码
#### Form属性
属性 | 说明 | 类型 | 默认值
------ | ------ | ------ | ------
formItems | item配置 | IFormItem[] | -
columns? | 列数 | number | 3

#### IFormItem属性
属性 | 说明 | 类型 | 默认值
------ | ------ | ------ | ------
id | 参数key | string | -
label | 前面的名称 | string | -
type? | item类型选择 | input\|select\|radio\|datePicker\|rangePicker\|checkbox | -
render? | 自定义表单组件 | (item: T) => React.ReactNode | -
initialValue? | 初始值 | any | -
rules? | 表单校验规则数组 | Rule[] | -
options? | select\|checkbox\|radio类型的可选项 | ISelectOption[] | -
props? | 各种类型的基本可选属性 | InputProps\|SelectProps<any>\|RadioGroupProps\|DatePickerProps\|RangePickerProps\|CheckboxGroupProps | -

#### ISelectOption属性
属性 | 说明 | 类型 | 默认值
------ | ------ | ------ | ------
label | 名称 | string | -
value | 值 | string\|number | -

```
import React, { useRef, useState } from 'react';
import { SForm } from '@szsk/rac';
import { Button } from 'antd';
import { IFormItem } from '@szsk/rac/lib/Form/type';

const Demo = () => {
  const formEle = useRef<any>(null);
  const [columns, setCol] = useState(3);

  const formItems: IFormItem[] = [
    {
      id: 'input',
      label: '输入框',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '我是item的props',
      },
    },
    {
      id: 'select',
      label: '下拉选择',
      type: 'select',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'radio',
      label: '单选框',
      type: 'radio',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'checkbox',
      label: '复选框',
      type: 'checkbox',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'datePicker',
      label: '时间选择',
      type: 'datePicker',
    },
  ];

  const onSubmit = () => {
    formEle.current.validateFields().then((values: any) => {
      console.log(values);
    });
  };

  return (
    <>
      <div className="f-mb-m">
        <Button className="f-mr-m" type="primary" onClick={() => setCol(3)}>
          3列
        </Button>
        <Button className="f-mr-m" type="primary" onClick={() => setCol(4)}>
          4列
        </Button>
        <Button className="f-mr-m" type="primary" onClick={() => setCol(5)}>
          5列
        </Button>
      </div>
      <SForm ref={formEle} formItems={formItems} columns={columns} />
      <Button type="primary" onClick={onSubmit}>
        提交
      </Button>
    </>
  );
};

export default Demo;

```
#### Search
用于列表搜索
#### SSearch属性
属性 | 说明 | 类型 | 默认值
------ | ------ | ------ | ------
formItems | item配置 | IFormItem[] | -
onSearch | search方法，默认挂载即搜索一次 | (params: any, toFirst: boolean, isReset: boolean) => any，params为搜索参数集合，toFirst为是否跳到第一页，isReset为是否为重置 | -
columns? | 列数 | number | 3
```
import React, { useRef, useState } from 'react';
import { SForm, SSearch } from '@szsk/rac';
import { Button } from 'antd';
import { IFormItem } from '@szsk/rac/lib/Form/type';

const Demo = () => {
  const formEle = useRef<any>(null);
  const [columns, setCol] = useState(3);

  const formItems: IFormItem[] = [
    {
      id: 'input',
      label: '输入框',
      type: 'input',
      props: {
        placeholder: '我是item的props',
      },
    },
    {
      id: 'select',
      label: '下拉选择',
      type: 'select',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'radio',
      label: '单选框',
      type: 'radio',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'checkbox',
      label: '复选框',
      type: 'checkbox',
      options: [
        {
          label: 'select1',
          value: '1',
        },
        {
          label: 'select2',
          value: '2',
        },
      ],
    },
    {
      id: 'datePicker',
      label: '时间选择',
      type: 'datePicker',
    },
  ];

  const onSubmit = (params: any, toFirst, isReset) => {
    console.log(params);
  };

  return (
    <>
      <div className="f-mb-m">
        <Button className="f-mr-m" type="primary" onClick={() => setCol(3)}>
          3列
        </Button>
        <Button className="f-mr-m" type="primary" onClick={() => setCol(4)}>
          4列
        </Button>
        <Button className="f-mr-m" type="primary" onClick={() => setCol(5)}>
          5列
        </Button>
      </div>
      <SSearch
        ref={formEle}
        formItems={formItems}
        columns={columns}
        onSearch={onSubmit}
      />
    </>
  );
};

export default Demo;
```
### 响应式自适应型
#### AutoSizeList
自适应容器下用于卡片列表的自适应排列
##### 属性

属性 | 说明 | 类型 | 默认值
------ | ------ | ------ | ------
list | 数据源列表 | T[] | -
CompCard | 组件形式渲染 | React.FC<{ data: T; idx: number }> | -
itemWidth | 卡片最小宽度 | number | -
space? | 两个item中间间距 | number | 10px
rowNum? | 显示的行数，有时候只是想显示几行推荐的 | number | -

##### 示例
```
import React, { useRef, useState } from 'react';
import { SForm, SSearch, AutoSizeList } from '@szsk/rac';
import { Button } from 'antd';
import { IFormItem } from '@szsk/rac/lib/Form/type';

const Demo = () => {
  const itemWidth = 100;
  const list = [
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
    {
      name: '100px',
    },
  ];
  const Card = (props: any) => {
    const { data, idx } = props;
    return (
      <div>{data.name}</div>
    );
  };

  return <AutoSizeList list={list} CompCard={<Card />} space={24} itemWidth={itemWidth} />;
};

export default Demo;
```
#### StickyTabs
tabs瀑布展示模块吸顶，整体模块head + tabs吸顶，tab切换与滚动联动
```
interface IProps {
  tabL: ITabItem[]; // tab列表
  offsetTop?: number; // 容器距顶fixed的top距离
  headEle?: React.ReactNode; // 顶部包裹固定的元素
  tabBarExtraContent?: any;
  // 副作用：smooth形式下点击tab滚动，短时间内可能会导致自行滚动的tab active无效
  behavior?: 'instant' | 'smooth'; // 滚动形式1.instant 表示滚动会直接跳转到目标位置 2.smooth 平滑滚动并产生过渡效果
  // scrollContainer是为了兼容容器是scroll的，传入容器元素的处理目前可能存在问题（要求容器顶部区域为固定高度区域，不滚动！！！）
  // 若不是必须先不考虑scrollContainer
  scrollContainer?: Element;
}

export interface ITabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

```
#### ContainImage
图片自适应块居中展示
```
interface IProps {
  imgSrc: string; // 图片地址
  width: string; // 容器宽度
  height: string; // 容器高度
  outerClass?: string; // 传入的class
  picCallback?: () => void; // 图片点击事件
}
```
#### ContainVideo
video自适应块居中展示，包含视频截图功能
```
interface IProps {
  videoSrc: string; // 视频地址
  style?: React.CSSProperties; // css样式
  width?: string; // 容器宽度
  height?: string; // 容器高度
  title?: string; // 视频modal title
  outerClass?: string; // 传入的class
  cropEnable?: boolean; // 是否可以截图
  videoCallback?: (dataUrl?: string) => void; // 弹窗点击确定回调
  children?: React.ReactNode;
}
```
<!-- #### ContainAttach
图片或video自适应块居中展示，根据type自动区分 -->
<!-- #### FileSwiper
图片或video自适应宽度个数轮播 -->

### 图片型
#### ContainImage
图片自适应块居中展示
```
interface IProps {
  imgSrc: string; // 图片地址
  width: string; // 容器宽度
  height: string; // 容器高度
  outerClass?: string; // 传入的class
  picCallback?: () => void; // 图片点击事件
}
```
#### CropPicModal
图片裁剪
```
interface IProps {
  pic: string; // pic url
  visible: boolean; // 控制Modal显示
  onCloseModal: () => void; // 关闭Modal回调
  onCropData: (data: any) => void; // // ok回调
}
```
#### PictrueJigsaw
一个容器内多图片拼图
```
interface IPictureJigsawProps {
  picList: string[];
  width: string; // 目前只接受px
  height: string; // 目前只接受px
  className?: string;
}
```
### 其他
#### TextCopy
复制功能
```
interface IProps {
  // 待复制文字
  text: string;
  // 复制成功回调
  onCopy?: (text: string, result: boolean) => void;
}
```
