import React,{ Component }  from 'react'
import { List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import "./index.css"

const CustomIcon = ({ type, className = '', size = 'md', ...restProps }) => (
         <svg
           className={`am-icon am-icon-${type.substr(1)} am-icon-${size} ${className}`}
           {...restProps}
         >
           <use xlinkHref={type} /> {/* svg-sprite-loader@0.3.x */}
           {/* <use xlinkHref={#${type.default.id}} /> */} {/* svg-sprite-loader@latest */}
         </svg>
     );
class Login extends Component {

    render(){
        const { getFieldProps } = this.props.form;
        return (
            <div className="login">
                <List>
                    <InputItem
                        placeholder="click label to focus input"
                        ref={el => this.labelFocusInst = el}
                    ><div onClick={() => this.labelFocusInst.focus()}>标题</div></InputItem>
                    <CustomIcon type={require('./../../img/user.svg')} />
                </List>
                <List renderHeader={() => 'Show clear'}>
                    <InputItem
                        {...getFieldProps('inputclear')}
                        clear
                        placeholder="displayed clear while typing"
                    >标题</InputItem>
                </List>
            </div>
        )
    }
}
export default createForm()(Login)