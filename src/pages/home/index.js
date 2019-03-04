import React ,{ Component } from 'react'
import { Icon,Accordion, List } from 'antd-mobile';
import { NavLink,withRouter } from 'react-router-dom'
import Super from "../../super"
import Nav from '../../components/Nav'
import Units from './../../units'
import './index.css'

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
                })
            }
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
    render(){
        const {menuTreeNode,data}=this.state;
        return (
            <div className="home">
                <Nav title="首页" data={data}/>
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