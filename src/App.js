import React, { Component } from 'react';
import logo from './logo.svg';
import Menu from './components/Menu/index.tsx';
import './App.css';
import './components/Menu/style/index.tsx';

const SubMenu = Menu.SubMenu;
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{width:250}}>
          
          <Menu selectedKeys={['item3']} defaultOpenKeys={['subMenu']}>
        <Menu.Item key="item1">item1</Menu.Item>
        <Menu.Item key="item2">item2</Menu.Item>
        <SubMenu title="subMenu" key="subMenu">
          <Menu.Item key="item3">item3</Menu.Item>
        </SubMenu>
      </Menu>
      <Menu 
            openKeys={["22"]}
            defaultSelectedKeys={["2"]}
            selectedKeys={["1"]}
            mode="inline"
            onClick={(params) => console.log(params)}
            >
            <Menu.Item key="1" disabled={true}>导航1</Menu.Item>
            <Menu.Item key="2">再导航2</Menu.Item>
            <Menu.SubMenu
              key="22"
              title="子导航22"
            >
              <Menu.Item key="3">子导航项3</Menu.Item>
              <Menu.Item key="4">子导航项4</Menu.Item>
              <Menu.SubMenu
                key="333"
                title="子导航333"
              >
                <Menu.Item key="5">子子导航5</Menu.Item>
                <Menu.Item key="6">子子导航5</Menu.Item>
              </Menu.SubMenu>
            </Menu.SubMenu>
          </Menu>

        </div>
       
      </div>
    );
  }
}

export default App;
