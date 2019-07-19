import React, {Component} from 'react'
import { Icon, Accordion, List, Popover } from 'antd-mobile';
import { NavLink, withRouter } from 'react-router-dom'
import Super from "../../super"
import Nav from '../../components/Nav'
import Storage from './../../units/storage'
import './index.css'
const Item = Popover.Item;

class Home extends Component {
	state = {
		menuTreeNode: [],
	}
	componentDidMount() {
		this.request()
	}
	request = () => {
		Super.super({
			url: 'api2/meta/menu/get_blocks',
		}).then((res) => {
			const currentBlockId=res.currentBlockId
			this.setBlocks(currentBlockId,res.blocks)
			const homeData = this.renderdata(res.blocks)
			this.setState({
				homeData,
				blocks:res.blocks,
			})
		})
	}	
	setBlocks=(blockId,resBlocks)=>{
		let {blocks}=this.state
		let blockList
		if(resBlocks){
			blocks=resBlocks
		}
		blocks.forEach((item)=>{
			if(item.id===blockId){
				blockList=item.l1Menus
			}
		})
		const menuTreeNode = this.renderMenu(blockList)
		const data = this.renderdata(blockList)		
		Storage.menuList=data   //普通菜单存储
		this.setState({
			menuTreeNode,
		})
	}
	renderdata = (data) => {
		data.forEach((item) => {
			item.value = item.id
			item.label = item.title
			if(item.l2Menus) {
				item.children = item.l2Menus
				item.children.forEach((it) => {
					it.value = it.id
					it.label = it.title
				})
			}
		})
		return data
	}
	renderMenu = (data) => {
		return data.map((item) => {
			if(item.l2Menus) {
				return <Accordion.Panel header={item.title} key={item.title}>
                            <List className="my-list">
                                { this.renderMenu(item.l2Menus) }
                            </List>
                        </Accordion.Panel>
			}
			return <List.Item key={item.title}>
                        <NavLink to={`/${item.id}`} style={{color:"#333"}}>{item.title}</NavLink>
                        <Icon type="right" size="sm"/>
                    </List.Item>
		})
	}
	handlePop = (value) => {
		this.props.history.push(`/${value}`)
	}
	render() {
		const {menuTreeNode,homeData} = this.state;
		const homePop = [ //右边导航下拉
			(<Item key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Item>),
			(<Item key="2" value="login" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
		]
		return(
			<div className="home">
                <Nav 
                    title="易+数据融合工具" 
                    data={homeData} 
                    handleSelected={this.handlePop}
					pops={homePop}
					level={1}
					setBlocks={this.setBlocks}
                />
                <div className="menuTreeNode">
                    <Accordion accordion key="menuTreeNode">
                        {menuTreeNode}
                    </Accordion>
                </div>
            </div>
		);
	}
}
export default withRouter(Home)