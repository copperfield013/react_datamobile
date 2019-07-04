import React, {Component} from 'react'
import { List, Toast, Popover, ActivityIndicator, Modal, Button, } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import Units from './../../units'
import TemplateDrawer from './../../components/TemplateDrawer'
import EditList from './../../components/FormCard/editList'
import RabcTemplateDrawer from './../../components/RabcTemplateDrawer'
import Storage from './../../units/storage'
import './index.css'
const Itempop = Popover.Item;
const alert = Modal.alert;

class Details extends Component {

	state = {
		itemList: [],
		optionsMap:{},
		animating: false,
		headerName: "",
		visibleNav: false,
		scrollIds: [],
		isDrawer:this.props.match?false:true,
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
		const {menuId,code} = this.props.match?this.props.match.params:this.props
		const fieldGroupId=this.props.match?null:this.props.fieldGroupId
		this.setState({menuId,code,fieldGroupId})
		this.loadRequest()
	}
	loadRequest = () => {
		const {menuId,code} = this.props.match?this.props.match.params:this.props
		const fieldGroupId=this.props.match?null:this.props.fieldGroupId
		this.setState({
			animating: true
		});
		let url
		if(fieldGroupId){
			url =`api2/meta/tmpl/dtmpl_config/rabc/${menuId}/${fieldGroupId}`
		}else{
			url =`api2/meta/tmpl/dtmpl_config/normal/${menuId}/`
		}
		Super.super({url}).then((res) => {
			//console.log(res)
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
				headerName: this.props.match?`${menuTitle}-${dataTitle}-详情`:`${menuTitle}-创建实体`,
			})	
		})		
	}
	loadDataToList=(dtmplGroup,fieldMap,arrayMap)=>{
		dtmplGroup.map((item)=>{
			let flag=false //是否添加关系
			const relaOptions = []
			if(item.composite){
				const model=item.fields
				const totalname=item.composite.cname
				item.lists=[]
				item.limitLen=1
				for(let k in arrayMap){
					if(k===item.id.toString()){
						item.lists.push(...arrayMap[k])
					}
				}
				if(item.composite.addType===5){
					flag=true
					item.composite.relationSubdomain.map((item) => {
						const list = {
							title:item,
							value:item,
							label:item,
						}
						relaOptions.push(list)
						return false
					})
				}
				item.lists.map((it,index)=>{
					it.list=[]
					const deletebtn = {
						type:"deletebtn",
						code:it.code,
						name:`deletebtn[${index}]`
					}
					it.list.push(deletebtn)
					if(flag){
						const relation = {
							type:"relation",
							value:it.relationLabel,
							title:"关系",
							fieldId:item.composite.c_id,
							validators:"required",
							name:`${totalname}[${index}].关系`,
							relationSubdomain:relaOptions,							
						}
						it.list.push(relation)
					}					
					for(let k in it.fieldMap){
						model.map((i)=>{
							if(k===i.id.toString()){
								const lastname=i.name.split(".")[1]
								const record={
									name:`${totalname}[${index}].${lastname}`,
									title:i.title,
									type:i.type,
									validators:i.validators,
									fieldId:i.fieldId,
									value:it.fieldMap[k],
									code:it.fieldMap.code,
									fieldAvailable:it.fieldAvailable,
								}
								it.list.push(Units.forPic(record))
							}
							return false
						})
					}
					return false
				})
			}else{				
				item.limitLen=4
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
				for(let k in optionsMap){
					optionsMap[k].map((item)=>{
						item.label=item.title
						return false
					})
				}
				this.setState({
					optionsMap,
					scrollIds,
					dtmplGroup,
					animating: false,
				})
			})	
		}else{
			this.setState({
				scrollIds,
				dtmplGroup,
				animating: false,
			})
		}		
	}
	addList = (list) => {
		const {dtmplGroup}=this.state
		const record=[]
		const relaOptions = []
		let flag=false //是否添加关系
		const totalname=list.composite.cname
		const code=Units.RndNum(9)
		const len=list.lists.length
		if(list.composite){
			const deletebtn = {
				type:"deletebtn",
				code,
				name:`deletebtn[${len}]`
			}
			record.push(deletebtn)
			if(list.composite.addType===5){				
				flag=true
				list.composite.relationSubdomain.map((item) => {
					const li = {
						title:item,
						label:item,
						value:item
					}
					relaOptions.push(li)
					return false
				})
			}
			if(flag){
				const len=list.lists.length
				const relation = {
					type:"relation",
					value:relaOptions.length===1?relaOptions[0].value:"",
					title:"关系",
					fieldId:list.composite.c_id,
					validators:"required",
					name:`${totalname}[${len}].关系`,
					relationSubdomain:relaOptions,							
				}
				record.push(relation)
			}	
		}
		list.fields.map((item)=>{
			const lastname=item.name.split(".")[1]
			const re={
				code,
				fieldAvailable:item.fieldAvailable,
				fieldId:item.fieldId,
				name:`${totalname}[${len}].${lastname}`,
				title:item.title,
				type:item.type,
				validators:item.validators,
				value:item.value
			}
			record.push(re)
			return false
		})
		
		const res={
			list:record,
			code
		}
		list.lists.push(res)
		dtmplGroup.map((item,index)=>{
			if(item.id===list.id){
				dtmplGroup.splice(index,list)
			}
			return false
		})
		this.setState({
			dtmplGroup
		})
	}
	handleSubmit = () => {
		const {code,menuId,dtmplGroup}=this.state
		const fieldGroupId=this.props.match?null:this.props.fieldGroupId
		this.setState({animating: true});
		this.props.form.validateFields({force: true}, (err, values) => { //提交再次验证
			if(!err){
				dtmplGroup.map((item)=>{
					if(item.composite){
						values[`${item.composite.cname}.$$flag$$`] = true
					}
					return false
				})
				for(let k in values){
					if(values[k] && values[k] instanceof Date){ //判断时间格式
						values[k]=Units.dateToString(values[k])
					}else if(values[k] && typeof values[k] === "object" && Array.isArray(values[k])){
						const totalName = k
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
					}else if(!values[k]){
						delete values[k]
					}
				}
				console.log(values)
				const formData = new FormData(); 
				formData.append('唯一编码', code?code:"");
				for(let k in values) {
					formData.append(k, values[k]);
				}
				let url
				if(fieldGroupId){
					url=`api2/entity/curd/save/rabc/${menuId}/${fieldGroupId}`
				}else{
					url=`api2/entity/curd/save/normal/${menuId}`
				}
				Super.super({
					url, 
					data:formData
				},'formdata').then((res)=>{
					this.setState({animating: false,showRabcTempDrawer:false});
					if(res && res.status==="suc"){
						Storage[`${menuId}`]=null
						Toast.success("保存成功！")
						if(!this.props.match){
							this.props.loadEntites(res.code,fieldGroupId)
						}else{
							this.props.history.push(`/${menuId}`)
						}
					}else{
						Toast.fail("保存失败!")
					}
				})
			}else{
				Toast.fail("必填选项未填！！")
				this.setState({animating: false});
			}
		})
	}
	onRef = (ref) => {
		this.SelectTemplate = ref
	}
	loadTemplate = (entities,addModal) => {
		entities.map((item)=>{
			for(let k in item.byDfieldIds){
				addModal.fields.map((it)=>{
					if(k===it.id.toString()){
						it.value=item.byDfieldIds[k]
					}
					return false
				})
			}
			this.addList(addModal)
			return false
		})	
	}
	deleteList = (code) => {
		let {dtmplGroup} = this.state
		dtmplGroup.map((item) => {
			if(item.composite) {
				item.lists = item.lists.filter((it) => it.code.includes(code)===false)
			}
			return false
		})
		Toast.success("删除成功！")
		this.setState({
			dtmplGroup
		})
	}
	showAlert = (code, e) => {
		e.stopPropagation()
		const alertInstance = alert('删除操作', '确认删除这条记录吗？', [
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
	seeMore=(record,Num)=>{ //折叠面板
		const {dtmplGroup}=this.state
		dtmplGroup.map((item)=>{
			if(item.id===record.id){
				item.limitLen=Num
			}
			return false
		})
		this.setState({
			dtmplGroup
		})
	}	
	render() {
		const data = Storage.menuList
		const {getFieldProps} = this.props.form;
		const {dtmplGroup,optionsMap,animating,headerName,menuId,visibleNav,scrollIds,
			showRabcTempDrawer,code,groupId,isDrawer} = this.state
		const detailPop = [
			( <Itempop key="5" value="home" icon={ <span className="iconfont" > &#xe62f; </span>}>首页</Itempop> ),
			( <Itempop key="1" value="user" icon={ <span className="iconfont" > &#xe74c; </span>}>用户</Itempop> ),
			( <Itempop key="3" value="save" icon={ <span className="iconfont" > &#xe61a; </span>}>保存</Itempop> ),
			( <Itempop key="4" value="nav" icon={ <span className="iconfont" > &#xe611; </span>}>导航</Itempop> ),
			( <Itempop key="2" value="loginOut" icon={ <span className="iconfont" > &#xe739; </span>}>退出</Itempop> ),
		]
		const drawerPop=[
			( <Itempop key="3" value="save" icon={ <span className="iconfont" > &#xe61a; </span>}>保存</Itempop> ),
		]
		return( <div className = "details" >
					<Nav title = {headerName}
						data = {data}
						handleSelected = {this.handlePop}
						isDrawer={isDrawer}
						shutRabcTem={this.props.match?null:this.props.shutRabcTem}
						pops = {this.props.match?detailPop:drawerPop}/>
					<div>
						{dtmplGroup && dtmplGroup.map((item, i) => {
							const selectionTemplateId=item.selectionTemplateId
							const dialogSelectType=item.dialogSelectType
							const rabcUncreatable=item.rabcUncreatable
							const rabcTemplateGroupId=item.rabcTemplateGroupId
							
							let rabcTemplatecreatable=false
							if(rabcTemplateGroupId && rabcUncreatable===null){
								rabcTemplatecreatable=true
							}
							return <List
										id = {item.title}	
										key = {`${item.id}[${i}]`}
										renderHeader = {() =>
											<div className = "listHeader">
												<span> {item.title} </span>
												{item.composite ?
													<div className = "detailButtons" >
														<span className = "iconfont"
															onClick = {() => this.addList(item)} > &#xe63d;
														</span> 
														{selectionTemplateId && dialogSelectType? 
														<span className = "iconfont"
															onClick = {() => this.SelectTemplate.onOpenChange(item)} >
															&#xe6f4; 
														</span>:null}
														{rabcTemplatecreatable && !isDrawer? //判断是否是弹出的抽屉
														<span className = "iconfont"
															onClick = {() =>this.setState({
																showRabcTempDrawer:true,
																groupId:item.id
																})} >
															&#xe61b;
														</span>:null}														
													</div>:null
												} 
											</div>}
									> 
									{ /* 为了弥补fixed之后的空白区域 */ }
									<div className = "fixedDiv" > </div>	
									{item.composite && item.lists?
										item.lists.map((it,index)=>{
											if(index<=item.limitLen){
												return <div key={it.code+index}>
															<EditList
																formList = {it}
																getFieldProps = {getFieldProps}
																optionsMap = {optionsMap}
																deleteList = {(e) => this.showAlert(it.code, e)}
															/>
															{index===item.limitLen && item.lists.length>item.limitLen+1?
															<span 
																className="more iconfont" 
																onClick={()=>this.seeMore(item,100)}>
																	&#xe624;
															</span>
															:null}
															{item.limitLen===100 && index===item.lists.length-1?
															<span 
																className="more iconfont trans" 
																onClick={()=>this.seeMore(item,1)}>
																	&#xe624;
															</span>
															:null}
														</div>
											}
											return false																					
										}):
										item.fields.map((it, index) => {
											if(index<=item.limitLen){
												return <div key = {it.id+index}>
															<FormCard
																formList = {it}
																getFieldProps = {getFieldProps}
																optionsMap = {optionsMap}
															/>
															{index===item.limitLen && item.fields.length>item.limitLen+1?
															<span 
																className="more iconfont" 
																onClick={()=>this.seeMore(item,100)}>
																	&#xe624;
															</span>
															:null}
															{item.limitLen===100 && index===item.fields.length-1?
															<span 
																className="more iconfont trans" 
																onClick={()=>this.seeMore(item,4)}>
																	&#xe624;
															</span>
															:null}
														</div>
													}
													return false
												})											
											
										} 
									</List>
						})} 
					</div> 
				<TemplateDrawer  //选择实体模板
					onRef = {this.onRef}
					menuId = {menuId}
					loadTemplate = {this.loadTemplate}
					/>
				<RabcTemplateDrawer 
					showRabcTempDrawer={showRabcTempDrawer}
					menuId = {menuId}
					code={code}
					groupId={groupId}
					dtmplGroup={dtmplGroup}
					loadTemplate={this.loadTemplate}
					shutRabcTem={()=>this.setState({
										showRabcTempDrawer:false,
										groupId:null
										})
					}
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