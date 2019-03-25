import React, {Component} from 'react'
import { Popover } from 'antd-mobile';
import Nav from '../../components/Nav'
const Item = Popover.Item;

export default class User extends Component {

	handlePop = (value) => {
		if(value === "home") {
			this.props.history.push(`/home`)
		} else if(value === "loginOut") {
			this.props.history.push(`/login`)
		}
	}
	render() {
		const userPop = [ //右边导航下拉
			(<Item key="1" value="home" icon={<span className="iconfont">&#xe74c;</span>}>首页</Item>),
			(<Item key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
		]
		return(
			<div className="home">
                <Nav 
                    title="易+数据融合工具"
                    handleSelected={this.handlePop}
                    pops={userPop}
                    />
                <div>
                    用户页
                </div>
            </div>
		);
	}
}