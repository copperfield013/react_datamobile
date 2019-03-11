import React ,{ Component } from 'react'
import { Icon,Accordion, List,Popover } from 'antd-mobile';
import { NavLink,withRouter } from 'react-router-dom'
import Super from "../../super"
import Nav from '../../components/Nav'
import './index.css'
const Item = Popover.Item;

const sessionStorage=window.sessionStorage
class Home extends Component{
    state={
        menuTreeNode:[],
	}
	componentWillMount(){
		this.request()
    }
    request=()=>{
		Super.super({
			url:'/api/menu/getMenu',                 
        }).then((res)=>{
            const data = this.renderdata(res.menus)
            const menuTreeNode = this.renderMenu(res.menus)
            this.setState({
                menuTreeNode,
                data
			})
        })
    }
	renderdata=(data)=>{
		data.map((item)=>{
			item["value"]=item.id
            item["label"]=item.title
            if(item.level2s){
                item["children"]=item.level2s
                item["children"].map((it)=>{
                    it["value"]=it.id
                    it["label"]=it.title
                    return false
                })
            }
            return false
        })
        sessionStorage.setItem("menuList",JSON.stringify(data))
        return data
    }
    renderMenu=(data)=>{
		return data.map((item)=>{
			if(item.level2s){
				return <Accordion.Panel header={item.title} key={item.title}>
                            <List className="my-list">
                                { this.renderMenu(item.level2s) }
                            </List>
                        </Accordion.Panel>				
			}
            return  <List.Item key={item.title}>
                        <NavLink to={`/${item.id}`} style={{color:"#333"}}>{item.title}</NavLink>
                        <Icon type="right" size="sm"/>
                    </List.Item>
		})
    }
    handlePop=(value)=>{
        if(value==="user"){
            this.props.history.push(`/user`)
        }else if(value==="loginOut"){
            this.props.history.push(`/login`)
        }
    }
    render(){
        const {menuTreeNode,data}=this.state;       
        const homePop=[ //右边导航下拉
            (<Item key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Item>),
            (<Item key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
            ]
        return (
            <div className="home">
                <Nav 
                    title="易+数据融合工具" 
                    data={data} 
                    handleSelected={this.handlePop}
                    pops={homePop}
                />
                <div className="menuTreeNode">
                    <Accordion accordion onChange={this.onChange} key="menuTreeNode">
                        {menuTreeNode}
                    </Accordion>
                </div>
            </div>
        );
    }
}
export default withRouter(Home)