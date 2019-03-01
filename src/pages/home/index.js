import React ,{ Component } from 'react'
import { Icon,Accordion, List,Popover } from 'antd-mobile';
import { NavLink,withRouter } from 'react-router-dom'
import Super from "./../../super"
import Nav from './../../components/Nav'
import './index.css'
const Item = Popover.Item;

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
            const menuTreeNode = this.renderMenu(res.menus)
            this.setState({
				menuTreeNode,
			})
        })
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
        const {menuTreeNode}=this.state;
        return (
            <div className="home">
                <Nav title="首页"/>
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