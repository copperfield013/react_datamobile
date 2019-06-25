import React, {Component} from 'react'
import { List, Toast, Popover, ActivityIndicator, Modal, Button, } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import superagent from 'superagent'
import Units from './../../units'
import TemplateDrawer from './../../components/TemplateDrawer'
import EditList from './../../components/FormCard/editList'
import './index.css'
const Itempop = Popover.Item;
const alert = Modal.alert;

const sessionStorage = window.sessionStorage
class Details extends Component {

	state = {
		itemList: [],
		optionsMap:{},
		animating: false,
		headerName: "",
		visibleNav: false,
		scrollIds: []
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	handleScroll = () => {
		const {scrollIds} = this.state
		const scrollY = window.scrollY
		const mainTopArr = [];
		let k = 0;
		if(scrollIds) { //滑动锁定导航
			for(let i = 0; i < scrollIds.length; i++) {
				let node = document.getElementById(scrollIds[i])
				if(node) {
					let top = Math.floor(node.offsetTop)
					mainTopArr.push(top);
				}
			}
			mainTopArr.sort((a, b) => a - b) //排序
			const fixedDiv = document.getElementsByClassName("fixedDiv")
			for(let i = 0; i < mainTopArr.length; i++) {
				if((scrollY + 45) > mainTopArr[i]) {
					k = i
					for(let i = 0; i < fixedDiv.length; i++) {
						fixedDiv[i].style.display = "none"
					}
					fixedDiv[k].style.display = "block"
				}
				if(scrollY <= 5) {
					k = -1
					for(let i = 0; i < fixedDiv.length; i++) {
						fixedDiv[i].style.display = "none"
					}
				}
			}
		}
		const lis = document.getElementsByClassName("am-list-header")
		if(lis && mainTopArr.length > 0) {
			for(let i = 0; i < lis.length; i++) {
				lis[i].style.position = "static"
			}
			if(k >= 0) {
				lis[k].style.position = "fixed"
				lis[k].style.top = "45px"
				lis[k].style.zIndex = "78"
				lis[k].style.background = "#F5F5F9"
			}
		}
	}
	componentWillMount() {
		const {menuId,code} = this.props.match.params
		this.setState({menuId,code,})
		this.loadRequest()
	}
	loadRequest = () => {
		const {menuId,code} = this.props.match.params
		this.setState({
			animating: true
		});
		const URL =`api2/meta/tmpl/dtmpl_config/normal/${menuId}/`
		Super.super({
			url: URL,
		}).then((res) => {
			const premises=res.premises
			const menuTitle=res.menu.title
			const dtmplGroup=res.config.dtmpl.groups
			if(code){
				this.loadData(dtmplGroup,menuTitle)
			}else{
				this.requestSelect(dtmplGroup)
				this.setState({
					headerName:`${menuTitle}-创建`,
				})	
			}					
		})
	}	
	loadData=(dtmplGroup,menuTitle)=>{
		const {menuId,code}=this.state
		let dataTitle
		Super.super({
			url:`api2/entity/curd/detail/${menuId}/${code}`,        
		}).then((resi)=>{
			const fieldMap=Units.forPic(resi.entity.fieldMap)  
			const arrayMap=resi.entity.arrayMap
			dataTitle=resi.entity.title
			for(let i in arrayMap){
				arrayMap[i].map((item)=>{
					item.fieldMap.code=item.code
					return false
				})
			}
			dtmplGroup=this.loadDataToList(dtmplGroup,fieldMap,arrayMap)	
			this.requestSelect(dtmplGroup)
			this.setState({
				headerName:`${menuTitle}-${dataTitle}-详情`,
			})	
		})		
	}
	loadDataToList=(dtmplGroup,fieldMap,arrayMap)=>{
		dtmplGroup.map((item)=>{
			if(item.composite){
				const model=item.fields
				item.lists=[]
				for(let k in arrayMap){
					if(k===item.id.toString()){
						item.lists.push(...arrayMap[k])
					}
				}
				item.lists.map((item)=>{
					item.list=[]
					const deletebtn = {
						type:"deletebtn",
						code:item.code,
					}
					item.list.push(deletebtn)
					for(let k in item.fieldMap){
						model.map((it)=>{
							if(k===it.id.toString()){
								const record={
									name:it.name,
									title:it.title,
									type:it.type,
									validators:it.validators,
									fieldId:it.fieldId,
									value:item.fieldMap[k],
									code:item.fieldMap.code,
									fieldAvailable:it.fieldAvailable,
								}
								item.list.push(Units.forPic(record))
							}
							return false
						})
					}
					return false
				})
			}else{
				item.fields.map((it)=>{
					for(let k in fieldMap){
						if(it.id.toString()===k){
							it.value=fieldMap[k]
						}
					}
					return false
				})
			}
			return false
		})	
		return dtmplGroup
	}
	requestSelect = (dtmplGroup) => {
		console.log(dtmplGroup)
		const selectId = []
		dtmplGroup.map((item) => {
			item.fields.map((it) => { 
				if(it.type === "select" || it.type === "label") {
					selectId.push(it.fieldId)
				}
				return false
			})
			return false
		})
		const scrollIds = []
		dtmplGroup.map((item) => {
			scrollIds.push(item.title)
			return false
		})
		if(selectId.length>0){
            Super.super({
                url:`api2/meta/dict/field_options`,       
                data:{
                    fieldIds:selectId.join(',')
                },
            }).then((res)=>{
				const optionsMap=res.optionsMap
                this.setState({
                    optionsMap,
					scrollIds,
					dtmplGroup,
					animating: false,
                })
            })
        }
	}
	addList = (list) => {
		const {dtmplGroup}=this.state
		const record=[]
		const code=Units.RndNum(9)
		list.fields.map((item)=>{
			const re={
				code,
				fieldAvailable:item.fieldAvailable,
				fieldId:item.fieldId,
				name:item.name,
				title:item.title,
				type:item.type,
				validators:item.validators,
			}
			record.push(re)
		})
		if(list.composite){
			const deletebtn = {
				type:"deletebtn",
				code,
			}
			record.unshift(deletebtn)
		}
		const res={
			list:record,
			code
		}
		list.lists.push(res)
		dtmplGroup.map((item,index)=>{
			if(item.id===list.id){
				dtmplGroup.splice(index,list)
			}
		})
		this.setState({
			dtmplGroup
		})
	}
	handleSubmit = () => {
		
	}
	onRef = (ref) => {
		this.SelectTemplate = ref
	}
	loadTemplate = (res, stmplId, tempcodes) => {
		const {itemList} = this.state
		if(tempcodes) {
			itemList.map((item, index) => {
				if(item.stmplId && item.stmplId === stmplId) {
					const codeArr = tempcodes.split(",")
					codeArr.map((it) => {
						this.addList(index, res.entities[it])
						return false
					})
				}
				return false
			})
		}
	}
	deleteList = (code) => {
		let {dtmplGroup} = this.state
		dtmplGroup.map((item) => {
			if(item.composite) {
				item.lists = item.lists.filter((it) => it.code.includes(code)===false)
			}
			return false
		})
		this.setState({
			dtmplGroup
		})
	}
	showAlert = (code, e) => {
		e.stopPropagation()
		const alertInstance = alert('删除操作', '确认删除这条记录吗???', [
			{text: '取消'},
			{text: '确认',onPress: () => this.deleteList(code)},
		]);
		setTimeout(() => {
			alertInstance.close();
		}, 10000);
	};
	handlePop = (value) => {
		if(value === "home") {
			this.props.history.push(`/home`)
		} else if(value === "loginOut") {
			this.props.history.push(`/login`)
		} else if(value === "user") {
			this.props.history.push(`/user`)
		} else if(value === "save") {
			this.handleSubmit()
		} else if(value === "nav") {
			this.handleNavAt()
		}
	}
	bodyScroll = (e) => {
		e.preventDefault();
	}
	handleNavAt = () => {
		document.addEventListener('touchmove', this.bodyScroll, {passive: false})
		this.setState({
			visibleNav: true
		})
	}
	scrollToAnchor = (anchorName) => { //导航
		if(anchorName) {
			let anchorElement = document.getElementById(anchorName);
			if(anchorElement) {
				window.scrollTo(0, anchorElement.offsetTop - 43);
			}
		}
		this.setState({
			visibleNav: false
		})
		document.removeEventListener('touchmove', this.bodyScroll, {passive: false})
	}
	onClose = () => {
		this.setState({
			visibleNav: false
		})
		document.removeEventListener('touchmove', this.bodyScroll, {passive: false})
	}
	render() {
		const data = JSON.parse(sessionStorage.getItem("menuList"))
		const {getFieldProps} = this.props.form;
		const {dtmplGroup,optionsMap,animating,headerName,menuId,visibleNav,scrollIds} = this.state
		const detailPop = [
			( <Itempop key="5" value="home" icon={ <span className="iconfont" > &#xe62f; </span>}>首页</Itempop> ),
			( <Itempop key="1" value="user" icon={ <span className="iconfont" > &#xe74c; </span>}>用户</Itempop> ),
			( <Itempop key="3" value="save" icon={ <span className="iconfont" > &#xe61a; </span>}>保存</Itempop> ),
			( <Itempop key="4" value="nav" icon={ <span className="iconfont" > &#xe611; </span>}>导航</Itempop> ),
			( <Itempop key="2" value="loginOut" icon={ <span className="iconfont" > &#xe739; </span>}>退出</Itempop> ),
		]
		return( <div className = "details" >
					<Nav title = {headerName}
						data = {data}
						handleSelected = {this.handlePop}
						pops = {detailPop}/>
					<div>
						{dtmplGroup && dtmplGroup.map((item, i) => {
							return <List
										id = {item.title}	
										key = {`${item.id}[${i}]`}
										renderHeader = {() =>
											<div className = "listHeader" >
												<span> {item.title} </span>
												{item.composite ?
													<div className = "detailButtons" >
														<span 	className = "iconfont"
																onClick = {() => this.addList(item)} > &#xe63d; </span> 
																{item.stmplId ? 
																<span 	className = "iconfont"
																		onClick = {() => this.SelectTemplate.onOpenChange(item)} >
																		&#xe6f4; 
																</span>:""
														}
													</div>:""
												} 
											</div>}
									> 
									{ /* 为了弥补fixed之后的空白区域 */ }
									<div className = "fixedDiv" > </div>	
									{item.composite ?
										item.lists.map((it,index)=>{
											return <EditList
														key = {`${it.id}[${index}]`}
														formList = {it}
														getFieldProps = {getFieldProps}
														optionKey = {it.optionKey}
														optionsMap = {optionsMap}
														deleteList = {(e) => this.showAlert(it.code, e)}
														/>
										}):
										item.fields.map((it, index) => {
											return <FormCard
														key = {`${it.id}[${index}]`}
														formList = {it}
														getFieldProps = {getFieldProps}
														optionKey = {it.optionKey}
														optionsMap = {optionsMap}
														/>
											})
									} 
									</List>
						})} 
					</div> 
				<TemplateDrawer
					onRef = {this.onRef}
					menuId = {menuId}
					loadTemplate = {this.loadTemplate}
					/>
				<ActivityIndicator
					toast
					text = "加载中..."
					animating = {animating}
					/>
				<Modal
					popup
					visible = {visibleNav}
					onClose = {this.onClose}
					animationType = "slide-up" >
					<List renderHeader = {() => <div > 请选择 </div>} className="popup-list"> 
						<div className = "navbox" > 
							{scrollIds.map((i, index) => ( 
								<List.Item key = {index} onClick = {() => this.scrollToAnchor(i)} > {i} </List.Item>))
							} 
						</div> 
						<List.Item >
							<Button onClick = {this.onClose}>取消</Button> 
						</List.Item> 
					</List> 
				</Modal> 
			</div>
	)
}
}
export default createForm()(Details);