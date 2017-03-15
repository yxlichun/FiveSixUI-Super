import * as React from 'react';

export interface ComponentStatus {
  [propName: string]: boolean | undefined;
}

/**
 * 获取元素的key值，多用于React.cloneElement，此函数不会对key值进行复制，此时需要手动复制
 * @param node 
 * @param prefix 
 * @param index 
 */
export function getKeyFromNode(node: React.ReactElement<any>, prefix: string = '', index): string {
  return node.key ? (node.key + '') : `${prefix}_${index}`;
}

/**
 * 根据状态获取组件的class名字,status的key值为最终生成类名的后缀名；
 * @param basic 
 * @param status 
 */
export function getClassName(basic: string | undefined, status: ComponentStatus): string {
  let className = [basic];
  for (let key in status) {
    if (status[key] === true) {
      className.push(`${basic}-${key}`)
    }
  }
  return className.join(' ');
}