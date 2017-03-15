import React from 'react';
import { shallow, mount } from 'enzyme';
import Menu from '../index.tsx';
import sinon from 'sinon';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

describe('Menu', () => {
  it('test custom use for: 1-level-menu', () => {
    const wrapper = shallow(
      <Menu>
        <Item key="1">menu</Item>
        <Item key="2">menu2</Item>
      </Menu>
    );
    expect(wrapper.find(Item)).toHaveLength(2);
  });

  it('test custom use for: 2-level-menu', () => {
    const wrapper = shallow(
      <Menu>
        <SubMenu>
          <Item key="1">menu</Item>
          <Item key="2">menu2</Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find(SubMenu)).toHaveLength(1);
    expect(wrapper.find(Item)).toHaveLength(2);
  });

  it('test custom use for: mixed-menu', () => {
    const wrapper = shallow(
      <Menu>
        <Item key="3">menu0</Item>
        <SubMenu>
          <Item key="1">menu</Item>
          <Item key="2">menu2</Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find(SubMenu)).toHaveLength(1);
    expect(wrapper.find(Item)).toHaveLength(3);
  });

  it('test special structure', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <SubMenu title="submenu">
          <Menu.Item key="1">menu1</Menu.Item>
          <Menu.Item key="2">menu2</Menu.Item>
        </SubMenu>
      </Menu>
    );

    wrapper.update();
  })

  it('test special structure: Multilayer nesting', () => {
    const wrapper = mount(
      <Menu selectedKeys={['item3']} defaultSelectedKeys={['item1']} defaultOpenKeys={['subMenu']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu" key="subMenu">
          <Menu.Item key="item3">item3</Menu.Item>
          <SubMenu title="subMenu2" key="subMenu2">
            <Menu.Item key="item32">item32</Menu.Item>
            <SubMenu title="subMenu3" key="subMenu3">
              <SubMenu title="subMenu4" key="subMenu4">
                <Menu.Item key="item34">item34</Menu.Item>
                <Menu.Item key="item35">item35</Menu.Item>
              </SubMenu>
              <Menu.Item key="item33">item33</Menu.Item>
            </SubMenu>
          </SubMenu>
        </SubMenu>
      </Menu>
    );

    wrapper.update();
  })
  it('should accept defaultSelectedKeys', () => {
    const wrapper = mount( // 渲染出来 必须使用mount
      <Menu defaultSelectedKeys={['item1']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <Menu.Item key="item3">item3</Menu.Item>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-item').at(0).hasClass('wl-menu-item-selected')).toBe(true);
    expect(wrapper.find('.wl-menu-item').at(1).hasClass('wl-menu-item-selected')).toBe(false);
  });

  it('should accept selectedKeys', () => {
    const wrapper = mount(
      <Menu selectedKeys={['item3']} defaultOpenKeys={['subMenu']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu" key="subMenu">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-item').at(2).hasClass('wl-menu-item-selected')).toBe(true);
  });

  it('should accept selectedKeys (the selectedKeys prop should higher than defaultSelectedKeys)', () => {
    const wrapper = mount(
      <Menu selectedKeys={['item3']} defaultSelectedKeys={['item1']} defaultOpenKeys={['subMenu']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu" key="subMenu">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-item').at(2).hasClass('wl-menu-item-selected')).toBe(true);
    expect(wrapper.find('.wl-menu-item').at(0).hasClass('wl-menu-item-selected')).toBe(false);
  });

  it('should accept defaultOpenKeys', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['subMenu1']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu1" key="subMenu1">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
        <SubMenu title="subMenu2" key="subMenu2">
          <Menu.Item key="item4">item4</Menu.Item>
          <Menu.Item key="item5">item5</Menu.Item>
        </SubMenu>
      </Menu>
    );
    // 对于defaultOpenKeys的修改不做任何响应？
    wrapper.setProps({ defaultOpenKeys: ['subMenu2'] });
    expect(wrapper.find('.wl-menu-item')).toHaveLength(3);

    wrapper.setProps({ openKeys: ['subMenu2'] });
    expect(wrapper.find('.wl-menu-item')).toHaveLength(4);
    wrapper.setProps({ openKeys: ['subMenu2', 'subMenu1'] });
    expect(wrapper.find('.wl-menu-item')).toHaveLength(5);
  });

  it('should accept className', () => {
    const wrapper = mount(
      <Menu className="test">
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu1" key="subMenu1">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
        <SubMenu title="subMenu2" key="subMenu2">
          <Menu.Item key="item4">item4</Menu.Item>
          <Menu.Item key="item5">item5</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find('.test')).toHaveLength(1);
  });

  it('select item', () => {
    const onItemSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect= { onItemSelect } openKeys={['subMenu1']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu1" key="subMenu1">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
        <SubMenu title="subMenu2" key="subMenu2">
          <Menu.Item key="item4">item4</Menu.Item>
          <Menu.Item key="item5">item5</Menu.Item>
        </SubMenu>
      </Menu>
    );
    wrapper.find('.wl-menu-item').at(0).simulate('click');
    expect(onItemSelect.mock.calls[0][0]).toHaveProperty('key', 'item1');
    wrapper.find('.wl-menu-item').at(2).simulate('click');
    expect(onItemSelect.mock.calls[1][0]).toHaveProperty('key', 'item3');
    expect(onItemSelect.mock.calls[1][0]).toHaveProperty('keyPath', ['subMenu1', 'item3']);
  });
});
