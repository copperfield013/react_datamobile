import { Button, Checkbox, Drawer, List, Toast } from 'antd-mobile';
import React, { Component } from 'react';
import Super from './../../super';
import './index.css';
const CheckboxItem = Checkbox.CheckboxItem;

export default class TemplateDrawer extends Component {

	componentDidMount() {
		this.props.onRef(this)
	}
	state = {
		checkboxdata: [],
		fieldWords: "",
		showDrawer: false,
		templateData: [],
	}
	onOpenChange = (item) => {
		let {menuId} = this.props
		let {fieldWords,showDrawer} = this.state
		const templateGroupId = item.id
		let newfields = []
		if(item.fields) { //获取字段名称
			item.fields.forEach((item) => {
				newfields.push(item.id)
			})
			if(!fieldWords) {
				fieldWords = newfields.join(",")
			}
			if(fieldWords && fieldWords !== newfields.join(",")) {
				fieldWords = newfields.join(",")
			}
		}
		let excepts
		let arr=[]
		if(item.lists && item.lists.length > 0) { //获取排除的code
			item.lists.forEach((item) => {
				arr.push(item.code)
			})
			excepts=arr.join(",")
		}
		if(showDrawer) {
			this.setState({
				showDrawer: false,
			});
		} else {
			Super.super({
				url:`api2/meta/tmpl/select_config/${menuId}/${templateGroupId}`,
			}).then((res) => {
				this.setState({
					showDrawer: true,
					templateGroupId,
					excepts,
					fieldWords,
					menuId,
					checkboxdata: [],
					fields:res.config.columns,
					addModal:item
				})
			})
			Super.super({
				url:`/api2/entity/curd/query_select_entities/${menuId}/${templateGroupId}`, 
				data:{
					excepts,
				}              
			}).then((res)=>{
				this.goPage(res.queryKey)
			})
		}
	}
	goPage = (queryKey,page) => {
		const {fields,pageInfo}=this.state
		Super.super({
			url: `api2/entity/curd/ask_for/${queryKey}`,
			data: {pageNo:pageInfo?pageInfo.pageNo+page:1}
		}).then((res) => {
			res.entities.forEach((item)=>{
				item.lists=[]
				for(let k in item.cellMap){
					fields.forEach((it,index)=>{
						if(it.id.toString()===k){
							const lis={
								code:item.code,
								value:item.cellMap[k],
								title:it.title,
								key:item.code+index
							}
							item.lists.push(lis)
						}
					})
				}
			})
			this.setState({
				templateData: res.entities,
				showDrawer: true,
				pageInfo:res.pageInfo,
				queryKey
			})
		})
	}
	handleDrawerOk = () => {
		const {checkboxdata,fieldWords,templateGroupId,menuId,addModal} = this.state
		const codes = checkboxdata.join(",")
		Super.super({
			url: `api2/entity/curd/load_entities/${menuId}/${templateGroupId}`,
			data: {
				codes,
				dfieldIds: fieldWords,
			}
		}).then((res) => {
			if(res.status === "suc") {
				this.props.loadTemplate(res.entities,addModal)
				this.setState({
					showDrawer: false,
				})
			} else {
				Toast.error(res.status)
			}
		})
	}
	changeCheckbox = (value) => {
		const {checkboxdata} = this.state
		if(checkboxdata.length === 0) {
			checkboxdata.push(value)
		} else {
			let flag = -1
			checkboxdata.forEach((item, index) => {
				if(item === value) {
					flag = index
				}
			})
			if(flag !== -1) {
				checkboxdata.splice(flag, 1)
			} else {
				checkboxdata.push(value)
			}
		}
		this.setState({
			checkboxdata,
		})
	}
	
	render() {
		const {showDrawer,pageInfo,templateData,queryKey} = this.state
		const totalPage = pageInfo ?pageInfo.virtualEndPageNo: ""
		let sidebar = (<div className="sideBar">
                        <div className="drawerBtns">
                            <p>{pageInfo?<span>第{pageInfo.pageNo}页</span>:""}</p>
							<p>{pageInfo&&pageInfo.pageNo!==1?<span onClick={()=>this.goPage(queryKey,-1)}>上一页</span>:null}</p>
                            <Button type="warning" inline size="small" onClick={this.onOpenChange}>取消</Button>
                            <Button type="primary" inline size="small" onClick={this.handleDrawerOk}>确定</Button>
                        </div>
                        {
                            templateData?templateData.map(item =>
                                <List key={item.code}>
									<CheckboxItem onChange={() => this.changeCheckbox(item.code)}>
										{item.lists.map(it =>
											<List.Item.Brief inline key={it.key}>{it.title}&nbsp;:&nbsp;{it.value}</List.Item.Brief>                                              
										)}
									</CheckboxItem>
								</List>
                            ):""
                        }
                        {pageInfo&&totalPage>=(pageInfo.pageNo+1)?
                        <Button onClick={()=>this.goPage(queryKey,+1)}>点击加载下一页</Button>:
                        <p className="nomoredata">没有更多了···</p>}
                    </div>)
		return(
			<Drawer
                className={showDrawer?"openDrawer":"shutDraw"}
                style={{ minHeight: document.documentElement.clientHeight-45 }}
                contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                sidebar={sidebar}
                open={showDrawer}
                position="right"
                touch={false}
                enableDragHandle
                onOpenChange={this.onOpenChange}
            >
            &nbsp;
            </Drawer>
		)
	}
}