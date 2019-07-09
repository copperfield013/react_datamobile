import React, {Component} from 'react'
import { List, InputItem, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Units from './../../units'
import Super from "./../../super"
import "./index.css"

class Login extends Component {

	state = {
		username:"",
        password:"",
	}
	componentDidMount() { //组件渲染完成之后触发此函数
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
	submit = () => {
		this.props.form.validateFields((error, value) => {
			if(!error) {
				Super.super({
					url: 'api2/auth/token',
					query: value
				}).then((res) => {
					if(res.status === "504") {
						Toast.info('服务器连接失败');
					} else {
						if(res.status === 'suc') {
							window.location.href="/#/home";
							Units.setLocalStorge("tokenName", res.token)
						} else if(res.errorMsg) {
							Toast.info(res.errorMsg);
						}
					}
				})
			}
		});
	}
	render() {
		const {username,password} = this.state
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
                <List style={{marginBottom:40}}>
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
                <Button type="primary" onClick={this.submit}>登录</Button>
            </div>
		)
	}
}
export default createForm()(Login)