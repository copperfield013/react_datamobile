import React, {Component} from 'react'
import { Popover } from 'antd-mobile';
import Nav from '../../components/Nav'
import Details from './../details'
import Super from './../../super'
const Item = Popover.Item;

export default class User extends Component {

	state={
		userName:"",
		code:"",

	}
	componentDidMount(){
		this.getUser()
	}
	getUser=()=>{
		Super.super({
			url:'api2/meta/user/current_user',                   
		}).then((res)=>{
			this.setState({
				userName:res.user.username,
				code:res.user.id
			})
		})
	}
	handlePop = (value) => {
		if(value === "save"){
			this.Details.handleSubmit()
		}else{
			this.props.history.push(`/${value}`)
		}
	}
	onRef = (ref) => {
		this.Details = ref
	}
	render() {
		const userPop = [ //右边导航下拉
			(<Item key="1" value="home" icon={<span className="iconfont">&#xe74c;</span>}>首页</Item>),
			(<Item key="3" value="save" icon={ <span className="iconfont" > &#xe61a; </span>}>保存</Item> ),
			(<Item key="2" value="login" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
		]
		const {userName,code}=this.state
		return(
			<div className="home">
                <Nav 
                    title={userName}
                    handleSelected={this.handlePop}
					pops={userPop}
					isUserpage="true"
                    />
					{code?<Details 
								onRef = {this.onRef}
								menuId="user"
								code={code}
							/>:null}
                
            </div>
		);
	}
}