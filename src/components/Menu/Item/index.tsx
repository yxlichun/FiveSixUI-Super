import * as React from "react";

import { MenuProps, ClickParams, SelectParams } from '..';
import { getClassName } from '../../_util/common';

export interface ItemProps extends MenuProps {
  itemKey: string;
  disabled?: boolean;
  keyPath?: Array<string>;
}

export default class Item extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props);
  }

  getSelectedStatus(key: string, keysArray: Array<string> | undefined) {
    return keysArray ? keysArray.indexOf(key) > -1 : false;
  }
  handleClick(e) {
    const { disabled, onClick, itemKey, onSelect, selectedKeys, multiple } = this.props;
    if (disabled) return;

    const newKeyPath = this.addKeyPath(this.props);
    const clickParams: ClickParams = {
      key: itemKey,
      keyPath: newKeyPath,
      item: this,
      domEvent: e
    }

    const selectParams: SelectParams = {
      key: itemKey,
      keyPath: newKeyPath,
      item: this,
      domEvent: e,
      selectedKeys: multiple ? (selectedKeys || []).concat([itemKey]) : [itemKey]
    }

    onClick && onClick(clickParams);
    onSelect && onSelect(selectParams);
  }
  addKeyPath(info: ItemProps) {
    return (info.keyPath || []).concat(info.itemKey);
  }
  render() {
    const { selectedKeys, itemKey, className, disabled, onClick } = this.props;
    const selected = this.getSelectedStatus(itemKey, selectedKeys);

    return (
      <li 
        className={getClassName(`${className}-item`, {
          selected,
          disabled
        })}
        onClick={ (e) => this.handleClick(e) }
      >
        { this.props.children }
      </li>
    )
  }
}
