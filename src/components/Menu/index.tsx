import * as React from "react";
import * as ReactDOM from 'react-dom';

import Item from './Item';
import SubMenu from './SubMenu';
import warning from '../_util/warning';
import { getClassName, getKeyFromNode } from '../_util/common';

/**
 * 【命名标准】组件名+Props
 */
export interface MenuProps {
  id?: string;
  defaultSelectedKeys?: Array<string>;// 当selected为undefined时才有效；
  selectedKeys?: Array<string>;
  defaultOpenKeys?: Array<string>;
  openKeys?: Array<string>;
  className?: string;
  prefixCls?: string;
  onClick?: (param: ClickParams) => void;
  onSelect?: (param: SelectParams) => void;
  onOpenChange?: (openKeys: Array<string>) => void;
  mode?: 'vertical' | 'horizontal' | 'inline'; // 暂不支持
  multiple?: boolean; // 暂不支持
  theme?: 'light' | 'dark'; // 暂不支持
}
/**
 * 【命名标准】组件名+State
 */
export interface MenuState {
  selectedKeys?: Array<string>;
  openKeys?: Array<string>;
}

export interface ClickParams {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
}

export interface SelectParams {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
  selectedKeys: Array<string>;
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  static Item = Item;
  static SubMenu = SubMenu;
  static defaultProps = {
    prefixCls: 'wl-menu',
    className: '',
    theme: 'light',
    mode: 'inline'
  }
  /**
   * 所有函数输入，均需显式定义传入类型
   * @param props 
   */
  constructor(props: MenuProps) {
    super(props);

    warning(
      !('onOpen' in props),
      '`onOpen` is removed, please use `onOpenChange` instead'
    );

    const state: MenuState = {
      openKeys: props.openKeys || props.defaultOpenKeys || [],
      selectedKeys: props.selectedKeys || props.defaultSelectedKeys || []
    }
    this.state = state;
  }

  componentWillReceiveProps(nextProps: MenuProps) {
    let state: MenuState = {};
    if ('selectedKeys' in nextProps) {
      state.selectedKeys = nextProps.selectedKeys || [];
    }
    if ('openKeys' in nextProps) {
      state.openKeys = nextProps.openKeys || [];
    }
    this.setState(state);
  }

  handleClick = (params: ClickParams) => {
    const { onClick } = this.props;
    onClick && onClick(params)
  }

  handleSelect = (param: SelectParams) => {
    const { onSelect } = this.props;
    const selectedKeys = this.state.selectedKeys;

    if (selectedKeys && selectedKeys.indexOf(param.key) > -1) {
      return;
    }

    this.setState({
      selectedKeys: param.selectedKeys
    });

    onSelect && onSelect(param);
  }

  handleOpen = (openKeys: Array<string>) => {
    const { onOpenChange } = this.props;

    this.setState({
      openKeys
    });
    
    onOpenChange && onOpenChange(openKeys);
  }

  render() {
    // 注意这里className的设置 能够允许用户设置className
    const className: string = `${this.props.className} ${this.props.prefixCls}`;
    const { mode, multiple, prefixCls } = this.props;

    const props = {
      className: prefixCls,
      mode,
      multiple,
      selectedKeys: this.state.selectedKeys,
      openKeys: this.state.openKeys,
      onClick: this.handleClick,
      onSelect: this.handleSelect,
      onOpenChange: this.handleOpen
    }
    return (
      <ul className={ getClassName( className, {
        root: true,
        inline: mode === 'inline'
      })}>
        {
          React.Children.map(this.props.children, (child: React.ReactElement<any>, index) => {
            return React.cloneElement(child, {
              ...props,
              itemKey: getKeyFromNode(child, `${className}-item`, index)
            })
          })
        }
      </ul>
    )
  }
}
