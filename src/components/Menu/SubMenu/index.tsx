import * as React from "react";
import { MenuProps, ClickParams } from '..';
import { getClassName, getKeyFromNode } from '../../_util/common';

export interface SubMenuProps extends MenuProps {
  itemKey: string;
  disabled?: boolean;
  title: string;
  keyPath?: Array<string>;
}

export default class SubMenu extends React.Component<SubMenuProps, any> {
  constructor(props: SubMenuProps) {
    super(props);
  }
  /**
   * 更倾向于下游来进行处理，要写更可信的下游
   * @param key 
   * @param keysArray 
   */
  getOpenStatus(key: string, keysArray: Array<string> | undefined) {
    if (keysArray) {
      for (let i = 0; i < keysArray.length; i++) {
        if (key == keysArray[i]) {
          return true;
        }
      }
    }
    return false;
  }
  componentWillReceiveProps(nextProps: SubMenuProps) {
    
  }
  handleClick(open:boolean) {
    const { disabled, onOpenChange, itemKey, openKeys } = this.props;
    if (disabled) return;

    const oldOpenKeys = openKeys || [];
    let newOpenKeys = oldOpenKeys.concat();
    if (open) { // 打开
      newOpenKeys = newOpenKeys.concat([itemKey]);
    } else { // 关闭
      const index = oldOpenKeys.indexOf(itemKey);
      index > -1 && newOpenKeys.splice(index, 1);
    }

    onOpenChange && onOpenChange(newOpenKeys);
  }

  addKeyPath(info: SubMenuProps) {
    return (info.keyPath || []).concat(info.itemKey);
  }
  render() {
    const { selectedKeys, itemKey, className, disabled, onClick, onSelect, onOpenChange, title, mode, openKeys, multiple } = this.props;

    const props = {
      className,
      selectedKeys,
      onClick,
      onSelect,
      onOpenChange,
      mode,
      openKeys,
      multiple,
      keyPath: this.addKeyPath(this.props)
    }
    const basicClassName = `${className}-submenu`;
    const open = this.getOpenStatus(itemKey, openKeys);

    return (
      <li 
        className={ getClassName(basicClassName, {
          disabled,
          selected: false,
          inline: mode === 'inline',
        }) }
      >
        <div 
          className={`${basicClassName}-title`}
          onClick={ () => this.handleClick(!open) }
        >
          { title }
        </div>
        { !open ? '' : 
          <ul className={ getClassName( className, { sub: true}) }>
            {
              React.Children.map(this.props.children, (child: React.ReactElement<any>, index) => {
                return React.cloneElement(child, {
                  ...props,
                  itemKey: getKeyFromNode(child, `${className}-item`, index)
                })
              })
            }
          </ul>
        }
      </li>
    )
  }
}
