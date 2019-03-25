import React, {Component} from 'react'
import { List, InputItem, Button, Toast, Flex, Checkbox } from 'antd-mobile';
import { createForm } from 'rc-form';
import Units from './../../units'
import Super from "./../../super"
import "./index.css"
const AgreeItem = Checkbox.AgreeItem;

class Login extends Component {

	state = {
		remember: true
	}
	componentDidMount() { //组件渲染完成之后触发此函数
		this.loadAccountInfo();
		window.addEventListener('keydown', this.handleKeyDown) //确认事件
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown)
	}
	handleKeyDown = (event) => { //按下enter键，触发login事件
		switch(event.keyCode) {
			case 13:
				this.submit();
				break;
			default:
				break;
		}
	}
	loadAccountInfo = () => {
		const accountInfo = Units.getCookie('accountInfo');
		if(Boolean(accountInfo) === false) {
			return false;
		} else {
			let username = "";
			let password = "";
			let index = accountInfo.indexOf("&");
			username = accountInfo.substring(0, index);
			password = accountInfo.substring(index + 1);
			this.setState({
				username,
				password,
			})
		}
	};
	submit = () => {
		const {remember} = this.state
		this.props.form.validateFields((error, value) => {
			if(!error) {
				Super.super({
					url: '/api/auth/token',
					query: value
				}).then((res) => {
					if(res.status === "504") {
						Toast.info('服务器连接失败');
					} else {
						if(res.status === 'suc') {
							if(remember) {
								const accountInfo = value.username + '&' + value.password;
								Units.setCookie('accountInfo', accountInfo, 30);
							} else {
								Units.delCookie('accountInfo');
								this.setState({
									username: "",
									password: "",
								})
							}
							window.location.href = "/#/home";
							Units.setLocalStorge("tokenName", res.token)
							Units.setLocalStorge("userinfo", value)
						} else if(res.errorMsg) {
							Toast.info(res.errorMsg);
						}
					}
				})
			} else {

			}
		});
	}
	remchange = (e) => {
		this.setState({
			remember: e.target.checked
		});
	}
	render() {
		const {username,password,remember} = this.state
		const {getFieldProps,getFieldError} = this.props.form;
		let uname = getFieldError('username')
		let pword = getFieldError('password')
		return(
			<div className="login">
                <h1>欢迎登录</h1>
                {(uname? <span className="err">{uname}</span> : null)}
                <List>
                    <InputItem
                        {...getFieldProps('username',{
                            initialValue:username,
                            rules:[{
                                required: true, message: `请输入用户名`,
                              }],
                        })}
                        clear
                        placeholder="请输入用户名">
                        <div><span className="iconfont">&#xe74c;</span></div>
                    </InputItem>
                </List>
                {(pword ? <span className="err">{pword}</span> : null)}
                <List>
                    <InputItem
                        {...getFieldProps('password',{
                            initialValue:password,
                            rules:[{
                                required: true, message: `请输入密码`,
                              }],
                        })}
                        clear
                        type="password"
                        placeholder="请输入密码">
                        <div><span className="iconfont">&#xe736;</span></div>
                    </InputItem>
                </List>
                <Flex>
                    <Flex.Item>
                        <AgreeItem onChange={this.remchange} checked={remember}>
                            记住密码
                        </AgreeItem>
                    </Flex.Item>
                </Flex>
                <Button type="primary" onClick={this.submit}>登录</Button>
            </div>
		)
	}
}
export default createForm()(Login)