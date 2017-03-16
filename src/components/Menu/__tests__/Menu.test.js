import React from 'react';
import { shallow, mount } from 'enzyme';
import Menu from '../index.tsx';
import sinon from 'sinon';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// 测试覆盖率只能表明你测到了，但并不能保证所有情形你都测到了，因此使用以下情形对测试case进行约束
// 以下为大致的测试步骤，使用渐进的顺序

// step1. test custom use 
//        正常场景测试，主要测试是否会报错，倾向使用shallow以加快测试速度；
// step2. test special use 
//        特殊、异常使用场景测试，主要测试是否会报错；
// step3. test props
//        API测试，普通属性测试，按照属性维度，测试正常值、异常值表现是否符合预期，此时测试更追求正确性，注意使用setProps函数对组件的表现进行动态跟踪；
// step4. test action props
//        API测试，事件属性测试，使用mock的方式，考察动作函数是否正常触发、触发时机、触发参数等是否符合预期；
// step5. test user interaction
//        用户行为测试，模拟用户动作，如多次点击、重复操作等；
// step6. test func
//        纯函数测试
// step7. test additional
//        其他补充测试


describe('Menu', () => {
  // step1. test custom use
  // 此时列举常见场景，可使用shallow的方式查看正常使用方式的正确性；
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
        <SubMenu>
          <Item key="3">menu</Item>
          <Item key="4">menu2</Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find(SubMenu)).toHaveLength(2);
    expect(wrapper.find(Item)).toHaveLength(4);
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

  // step2. test special use
  // 此时列举极端使用场景，使异常情形下不至于出现不可收敛的错误；
  it('test special use for special structure', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <SubMenu title="submenu">
          <Menu.Item key="1">menu1</Menu.Item>
          <Menu.Item key="2">menu2</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find(SubMenu)).toHaveLength(1);
    expect(wrapper.find(Item)).toHaveLength(0);
  })

  it('test special use for multilayer nesting', () => {
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

  it('test special use for wrong props', () => {
    const wrapper = mount(
      <Menu mode="horizontal" selectedKeys={['item3']} defaultSelectedKeys={['item1']} defaultOpenKeys={['subMenu2']}>
        <SubMenu title="submenu">
          <Menu.Item key="1">menu1</Menu.Item>
          <Menu.Item key="2">menu2</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find(SubMenu)).toHaveLength(1);
    expect(wrapper.find(Item)).toHaveLength(0);
  })

  // step3. test props 
  // 逐个测试传入属性，并尽可能的测试多种情形，此时需渲染出来进行测试，需使用mount；
  // 可参考测试路线：无、有（正常值、异常值）、搭配
  it('test props: defaultSelectedKeys', () => {
    let wrapper = mount( // 渲染出来 必须使用mount
      <Menu>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <Menu.Item key="item3">item3</Menu.Item>
      </Menu>
    );
    // 无
    expect(wrapper.find('.wl-menu-item-selected')).toHaveLength(0);

    // 有：正常值
    wrapper = mount( // 渲染出来 必须使用mount
      <Menu defaultSelectedKeys={['item1']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <Menu.Item key="item3">item3</Menu.Item>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-item').at(0).hasClass('wl-menu-item-selected')).toBe(true);

    // 有：异常值
    wrapper = mount( // 渲染出来 必须使用mount
      <Menu defdefaultSelectedKeys={null}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <Menu.Item key="item3">item3</Menu.Item>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-item-selected')).toHaveLength(0);
  });

  it('test props: selectedKeys', () => {
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

  it('test props: selectedKeys (the selectedKeys prop should higher than defaultSelectedKeys)', () => {
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

    wrapper.setProps({selectedKeys: ["item1"]});
    expect(wrapper.find('.wl-menu-item').at(2).hasClass('wl-menu-item-selected')).toBe(false);
    expect(wrapper.find('.wl-menu-item').at(0).hasClass('wl-menu-item-selected')).toBe(true);
  });

  it('test props: defaultOpenKeys、openKeys', () => {
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

  it('test props: className', () => {
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

  it('test props: disabled (SubMenu)', () => {
    const onOpen = jest.fn();
    const wrapper = mount(
      <Menu onOpenChange= { onOpen }>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu1" key="subMenu1" disabled={true}>
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
        <SubMenu title="subMenu2" key="subMenu2">
          <Menu.Item key="item4">item4</Menu.Item>
          <Menu.Item key="item5">item5</Menu.Item>
        </SubMenu>
      </Menu>
    );
    expect(wrapper.find('.wl-menu-submenu-disabled')).toHaveLength(1);
    wrapper.find('.wl-menu-submenu-title').at(0).simulate('click');
    expect(onOpen.mock.calls).toEqual([]);
  });

  it('test props: disabled (Item)', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect= { onSelect }>
        <Menu.Item key="item1" disabled={true}>item1</Menu.Item>
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
    expect(wrapper.find('.wl-menu-item-disabled')).toHaveLength(1);
    wrapper.find(Item).at(0).simulate('click');
    expect(onSelect.mock.calls).toEqual([]);
  });
  // step4. test action props
  // 测试传入事件，事件是否正确触发，触发参数是否正常？
  it('test action: onSelect (select item)', () => {
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

  it('test action: onOpenChange (open submenu)', () => {
    const onOpen = jest.fn();
    const wrapper = mount(
      <Menu onOpenChange= { onOpen }>
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
    expect(wrapper.find('.wl-menu-submenu')).toHaveLength(2);
    wrapper.find('.wl-menu-submenu-title').at(0).simulate('click');
    expect(onOpen.mock.calls[0][0]).toEqual(['subMenu1']);
    wrapper.find('.wl-menu-submenu-title').at(1).simulate('click');
    expect(onOpen.mock.calls[1][0]).toEqual(['subMenu1', 'subMenu2']);
  });

  it('test action: onOpenChange (close submenu)', () => {
    const onOpen = jest.fn();
    const wrapper = mount(
      <Menu onOpenChange= { onOpen } defaultOpenKeys={["subMenu1"]}>
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
    wrapper.find('.wl-menu-submenu-title').at(0).simulate('click');
    expect(onOpen.mock.calls[0][0]).toEqual([]);
  });
  // step5. test user interaction
  // 模拟用户操作顺序，进行相关属性的行为测试
  it('test user interaction: click selected item', () => {
    const onItemSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect= { onItemSelect } openKeys={['subMenu1']} selectedKeys={['item1']}>
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
    wrapper.find(Item).at(0).simulate('click');
    expect(onItemSelect.mock.calls).toEqual([]);
  });
  // step6. test additional
  // 测试一些其他相关函数
  it('onOpen warning', () => {
    const wrapper = mount(
      <Menu onOpen={'ddd'}>
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

    wrapper.update();
  });
});
