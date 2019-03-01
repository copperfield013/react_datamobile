import React,{ Component } from 'react'
import { List, InputItem,Button,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Units from './../../units'
import Super from "./../../super"
import "./index.css"

class Login extends Component {
    submit = () => {
        this.props.form.validateFields((error, value) => {
          if (!error) {
            Super.super({
                url:'/api/auth/token',  
                query:value             
            }).then((res)=>{
                if(res.status === "504"){
                    Toast.info('服务器连接失败');
                }else{
                    if(res.status === 'suc'){ 
                        // if(remember){
                        //     const accountInfo = username+ '&' +password;
                        //     Units.setCookie('accountInfo',accountInfo,30);
                        // }else {
                            Units.delCookie('accountInfo');
                            this.setState({
                                username:"",
                                password:"",
                            })
                        //}
                        window.location.href="/#/home";
                        Units.setLocalStorge("tokenName",res.token)
                        Units.setLocalStorge("userinfo",value)
                    }else if(res.errorMsg){
                        Toast.info(res.errorMsg);
                    }
                }
            })
          }
        });
    }
    render(){
        const { getFieldProps } = this.props.form;
        return (
            <div className="login">
                <h1>欢迎登录</h1>
                <List>
                    <InputItem
                        {...getFieldProps('username')}
                        clear
                        placeholder="请输入用户名">
                        <div>图标</div>
                    </InputItem>
                </List>
                <List>
                    <InputItem
                        {...getFieldProps('password')}
                        clear
                        type="password"
                        placeholder="请输入密码">
                        <div>图标</div>
                    </InputItem>
                </List>
                <a className="forgetPass">记住密码</a>
                <Button type="primary" onClick={this.submit}>登录</Button>
            </div>
        )
    }
}
export default createForm()(Login)