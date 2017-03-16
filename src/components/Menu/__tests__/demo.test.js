import React from 'react';
import Menu from '..';
import renderer from 'react-test-renderer';

// 简陋版GUI测试
// 在最开始需要撰写简单的应用场景，在开发、迭代时会提示对界面的更改，以确保更改是符合预期的

const SubMenu = Menu.SubMenu;

test('Menu demo', () => {
  const component = renderer.create(
    <Menu selectedKeys={['item3']} defaultSelectedKeys={['item1']} defaultOpenKeys={['subMenu']}>
      <Menu.Item key="item1">item1</Menu.Item>
      <Menu.Item key="item2">item2</Menu.Item>
    </Menu>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Menu demo', () => {
  const component = renderer.create(
    <Menu selectedKeys={['item3']} defaultSelectedKeys={['item1']} defaultOpenKeys={['subMenu']}>
      <Menu.Item key="item1">item1</Menu.Item>
      <Menu.Item key="item2">item2</Menu.Item>
      <SubMenu title="subMenu" key="subMenu">
        <Menu.Item key="item3">item3</Menu.Item>
      </SubMenu>
    </Menu>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Menu demo', () => {
  const component = renderer.create(
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
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});