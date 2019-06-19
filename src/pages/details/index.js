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
		this.loadRequest(menuId, code)
	}
	loadRequest = (menuId, code) => {
		this.setState({
			animating: true
		});
		const URL =`api2/meta/tmpl/dtmpl_config/normal/${menuId}/`
		Super.super({
			url: URL,
		}).then((res) => {
			const formltmpl=[]
            const editformltmpl=[]
			const premises=res.premises
			const menuTitle=res.menu.title
			let dataTitle
			res.config.dtmpl.groups.map((item)=>{
                if(item.composite===null){
                    formltmpl.push(item)
                }else{
                    editformltmpl.push(item)
                }
                return false
			})
			 //console.log(formltmpl)
			//console.log(editformltmpl)
			if(code){
				Super.super({
					url:`api2/entity/curd/detail/${menuId}/${code}`,        
				}).then((resi)=>{
					const fieldMap=Units.forPic(resi.entity.fieldMap)  
					const arrayMap=resi.entity.arrayMap
					for(let i in arrayMap){
						arrayMap[i].map((item)=>{
							item.fieldMap.code=item.code
							return false
						})
					}
					formltmpl.map((item)=>{
						item.fields.map((it)=>{
							for(let k in fieldMap){
								if(it.id.toString()===k){
									it.value=fieldMap[k]
								}
							}
							return false
						})
						return false
					})	
					editformltmpl.map((item)=>{
						const model=item.fields
						console.log(model)
						item.lists=[]
						for(let k in arrayMap){
							if(k===item.id.toString()){
								item.lists.push(...arrayMap[k])
							}
						}
						//console.log(item.lists)
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
						return false
					})	
					console.log(editformltmpl)		
					this.requestSelect([...formltmpl,...editformltmpl], premises)
					this.setState({
						headerName:`${menuTitle}-${dataTitle}-详情`,
					})	
				})		
			}else{
				this.requestSelect(res.config.dtmpl.groups, premises)
				this.setState({
					headerName:`${menuTitle}-创建`,
				})	
			}					
		})
	}	
	requestSelect = ( itemList, premises) => {
		//console.log(itemList)
		const selectId = []
		itemList.map((item) => {
			item.fields.map((it) => { 
				if(it.type === "select" || it.type === "label") {
					selectId.push(it.fieldId)
				}
				return false
			})
			return false
		})
		const scrollIds = []
		itemList.map((item) => {
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
				//this.reloadItemList(itemList, premises, optionsMap)
                this.setState({
                    optionsMap,
					scrollIds,
					itemList,
					animating: false,
                })
            })
        }
	}
	addList = (index, data) => {
		let {itemList,optionsMap} = this.state
		const needList = itemList[index]
		const i = needList.i >= 0 ? (needList.i + 1) : 0
		const descs = []
		const totalNm = needList.composite.name
		//删除按钮                                              
		const deletebtn = {}
		deletebtn["type"] = "deletebtn"
		deletebtn["deleteCode"] = `${totalNm}[${i}]`
		deletebtn["name"] = `${totalNm}[${i}].deleteCode`
		descs.push(deletebtn)
		if(needList.composite.addType === 5) { //添加关系选择
			const relation = {}
			const composite = needList.composite
			const relaOptions = []
			composite.relationSubdomain.map((item) => {
				const list = {}
				list["title"] = item
				list["value"] = item
				list["label"] = item
				relaOptions.push(list)
				return false
			})
			relation["id"] = composite.id
			relation["type"] = "relation"
			relation["title"] = "关系"
			relation["validators"] = "required"
			relation["name"] = `${totalNm}.关系`
			relation["relationSubdomain"] = relaOptions
			relation["value"] = composite.relationSubdomain.length===1?composite.relationSubdomain[0]:""
			descs.push(relation)
			//optArr[0][`field_${composite.id}`] = relaOptions
		}
		const onlycode = {}
		onlycode["type"] = "onlycode"
		onlycode["name"] = `${totalNm}.code`
		if(data) {
			onlycode["value"] = data["唯一编码"]
		}
		descs.push(onlycode)

		descs.push(...needList.descs)
		const list = {}
		list["i"] = i
		list["id"] = needList.id
		list["title"] = needList.title
		list["composite"] = needList.composite
		list["descs"] = needList.descs
		if(needList.stmplId) {
			list["stmplId"] = needList.stmplId
		}
		const arr = []
		descs.map((item) => {
			const lasname = item.name.split(".")[1]
			const list = {}
			for(let k in item) {
				if(k === "name") {
					list[k] = `${totalNm}[${i}].${lasname}`
				} else {
					list[k] = item[k]
				}
				if(data) { //从模板中赋值
					for(let e in data) {
						const itemN = item["name"].split(".")[1]
						const dataN = e.split(".")[1]
						if(itemN === dataN) {
							list["value"] = data[e]
						}
					}
				}
			}
			arr.push(list)
			return false
		})
		if(needList.fields) { //有fields,说明添加了1次以上
			const field = needList.fields
			field.push(...arr)
			list["fields"] = field
		} else {
			list["fields"] = arr
		}
		itemList.splice(index, 1, list)
		this.setState({
			itemList,
			optionsMap
		})
	}
	handleSubmit = () => {
		const {code,totalNameArr} = this.state //详情codes和整个记录的code
		this.props.form.validateFields({force: true}, (err, values) => { //提交再次验证
			for(let k in values) {
				//name去除图片
				if(values[k] && typeof values[k] === "object" && !Array.isArray(values[k]) && !values[k].name) {
					values[k] = Units.dateToString(values[k])
				} else if(values[k] && typeof values[k] === "object" && Array.isArray(values[k])) {
					const totalName = k
					values[`${totalName}.$$flag$$`] = true
					values[k].map((item, index) => {
						for(let e in item) {
							if(e === "关系") {
								e = "$$label$$"
								values[`${totalName}[${index}].${e}`] = item["关系"]
							} else if(e.indexOf("code") > -1) {
								if(item[e]) {
									values[`${totalName}[${index}].唯一编码`] = item[e]
								} else {
									delete item[e]
								}
							} else if(item[e] === undefined) {
								delete item[e] //删除未更改的图片数据
							} else {
								values[`${totalName}[${index}].${e}`] = item[e]
							}
						}
						return false
					})
					delete values[k] //删除原始的对象数据
				} else if(values[k] === undefined) {
					delete values[k] //删除未更改的图片数据(基本信息)
				}
			}
			totalNameArr.map((item) => {
				values[`${item}.$$flag$$`] = true
				return false
			})
			console.log(values)
			if(!err) {
				this.setState({
					animating: true
				});
				const tokenName = Units.getLocalStorge("tokenName")
				const formData = new FormData();
				const {menuId,} = this.state
				if(code){
					formData.append('唯一编码', code);
				}
				for(let k in values) {
					formData.append(k, values[k] ? values[k] : "");
				}
				superagent
					.post(`/api/entity/curd/update/${menuId}`)
					.set({
						"datamobile-token": tokenName
					})
					.send(formData)
					.end((req, res) => {
						this.setState({
							animating: false
						});
						if(res.status === 200) {
							if(res.body.status === "suc") {
								Toast.info("保存成功！")
								this.props.history.go(-1)
							} else {
								Toast.fail(res.body.status)
							}
						} else if(res.status === 403) {
							Toast.info("请求权限不足,可能是token已经超时")
							window.location.href = "/#/login";
						} else if(res.status === 404 || res.status === 504) {
							Toast.info("服务器未开···")
						} else if(res.status === 500) {
							Toast.info("后台处理错误。")
						}
					})
			} else {
				Toast.fail("必填选项未填！！")
			}
		})
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
	deleteList = (deleteCode) => {
		let {itemList} = this.state
		itemList.map((item) => {
			if(item.composite) {
				item.fields = item.fields.filter((it) => it.name.indexOf(deleteCode) === -1)
			}
			return false
		})
		this.setState({
			itemList
		})
	}
	showAlert = (deleteCode, e) => {
		e.stopPropagation()
		const alertInstance = alert('删除操作', '确认删除这条记录吗???', [
			{text: '取消'},
			{text: '确认',onPress: () => this.deleteList(deleteCode)},
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
		const {itemList,optionsMap,animating,headerName,menuId,visibleNav,scrollIds} = this.state
		//console.log(itemList)
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
						{itemList.map((item, i) => {
							return <List
										id = {item.title}	
										key = {`${item.id}[${i}]`}
										renderHeader = {() =>
											<div className = "listHeader" >
												<span> {item.title} </span>
												{item.composite ?
													<div className = "detailButtons" >
														<span 	className = "iconfont"
																onClick = {() => this.addList(i)} > &#xe63d; </span> 
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
									{item.fields&&!item.composite ? 
										item.fields.map((it, index) => {
											return <FormCard
														key = {`${it.id}[${index}]`}
														formList = {it}
														getFieldProps = {getFieldProps}
														optionKey = {it.optionKey}
														optionsMap = {optionsMap}
														deleteList = {(e) => this.showAlert(it.deleteCode, e)}
														/>
											}):""
									}	
									{item.composite ?
										item.lists.map((it,index)=>{
											return <EditList
														key = {`${it.id}[${index}]`}
														formList = {it}
														getFieldProps = {getFieldProps}
														optionKey = {it.optionKey}
														optionsMap = {optionsMap}
														deleteList = {(e) => this.showAlert(it.deleteCode, e)}
														/>
										}):""
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
							<Button onClick = {this.onClose} >取消</Button> 
						</List.Item> 
					</List> 
				</Modal> 
			</div>
	)
}
}
export default createForm()(Details);