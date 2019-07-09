import { ActivityIndicator, Button, Card, Drawer, List, Modal, Popover, Toast, } from 'antd-mobile';
import React, { Component } from 'react';
import Nav from './../../components/Nav';
import SearchForm from './../../components/SearchForm';
import Super from './../../super';
import Units from './../../units';
import './index.css';
import Storage from './../../units/storage'
const Item = List.Item;
const Itempop = Popover.Item;
const alert = Modal.alert;

export default class ActTable extends Component {

	state = {
		menuTitle: '',
		showDrawer: false,
		searchList: [],
		optArr: {},
		animating: false,
		menuId:this.props.match.params.menuId
	}
	componentWillMount() {
		const {menuId}=this.state
		this.requestList(menuId)
	}
	componentWillUnmount() {
		clearTimeout(this.closeTimer);
	}
	componentWillReceiveProps(nextProps){
		const {menuId} = nextProps.match.params
		this.setState({menuId})
		const url = decodeURI(this.props.history.location.search) //获取url参数(页码)，并解码
		if(url) {
			this.requestList(menuId, Units.urlToObj(url),true)
		} else {
            Storage[`${menuId}`]=null //刷新列表数据
			this.requestList(menuId)
		}

	}
	//isPushUrl=true时，后退获得的url已有参数，不需要push链接,不然会报错
	requestList = (menuId, data, isPushUrl) => {
		this.setState({
			animating: true
		})
		if(data && data.pageNo && data.pageSize && !isPushUrl) {
			this.props.history.push(`/${menuId}?pageNo=${data.pageNo}&pageSize=${data.pageSize}`)
		}
		Super.super({
			url: `api2/entity/curd/start_query/${menuId}`,
			data:data,
		}).then((res) => {
			document.removeEventListener('touchmove', this.bodyScroll, {
				passive: false
			})
			if(res) {
				const fieldIds=[]
				res.ltmpl.criterias.map((item)=>{
					if(item.inputType==="select"){
						fieldIds.push(item.fieldId)
					}
					const criteriaValueMap=res.criteriaValueMap
					for(let k in criteriaValueMap){
						if(k===item.id.toString()){
							item.value=criteriaValueMap[k]
						}
					}
					return false
				})           
				window.scrollTo(0, 0)
				this.setState({
					menuTitle: res.menu.title,
					listLtmpl: res.ltmpl.columns,
					queryKey:res.queryKey,
					searchList: res.ltmpl.criterias,
					showDrawer: false,
					searchFieldIds:fieldIds,
					animating: false
				})
				if(Storage[`${menuId}`] && !data){
					const res= Storage[`${menuId}`]
					this.sessionTodo(res)
				}else{
					this.queryList(res.queryKey,data)
				}
			}
		 })
	}
	queryList=(queryKey,data)=>{
        const {menuId}=this.state
		Super.super({
			url:`api2/entity/curd/ask_for/${queryKey}`,     
			data           
		}).then((res)=>{
			Storage[`${menuId}`]=res
			this.sessionTodo(res)
		})          
	}
	sessionTodo=(data)=>{
		const {listLtmpl}=this.state
		let isUnClickAble=true
        data.entities.map((item)=>{
			item.fields=[]
			for(let k in item.cellMap){
				listLtmpl.map((it)=>{
					if(it.title==="操作"){
						isUnClickAble=false
					}
					if(k===it.id.toString()){
						const list={
							title:it.title,
							value:item.cellMap[k],
						}
						item.fields.push(list)
					}
					return false
				})
			}
            return false
		})
        this.setState({
			list:data.entities,
			isUnClickAble,//判断列表是否可以点击进入详情页（统计页面没有详情页）
            pageInfo:data.pageInfo,
            currentPage:data.pageInfo.pageNo,   
			isSeeTotal:undefined,
            Loading:false,
            pageSize:data.pageInfo.pageSize,
        })
    }
	handlePop = (value) => {
		const {menuId} = this.state
		if(value === "search") {
			this.onOpenChange()
			this.getSearchOptions()
		}else if(value === "create") {
			this.props.history.push(`/create/${menuId}`)
		}else{
			this.props.history.push(`/${value}`)
		}
	}
	getSearchOptions = () => {
		const {searchFieldIds} = this.state;
		if(searchFieldIds.length > 0) {
			Super.super({
				url:`api2/meta/dict/field_options`,  
				data:{
					fieldIds:searchFieldIds
				}      
			},).then((res)=>{
				this.setState({
					optArr:res.optionsMap
				})
			})
		}
	}
	cardClick = (code) => {
		const {menuId} = this.state
		this.props.history.push(`/${menuId}/${code}`)
	}
	bodyScroll = (e) => {
		e.preventDefault();
	}
	onOpenChange = () => {
		const {showDrawer} = this.state
		//console.log(showDrawer);
		this.setState({
			showDrawer: !showDrawer
		});
		if(showDrawer) { //固定页面
			document.removeEventListener('touchmove', this.bodyScroll, {
				passive: false
			})
		} else {
			document.addEventListener('touchmove', this.bodyScroll, {
				passive: false
			})
		}
	}
	goPage = (no) => {
		const {pageInfo,menuId,searchwords} = this.state
		let data = {}
		const topageNo = pageInfo.pageNo + no
		data.pageNo = topageNo
		data.pageSize = pageInfo.pageSize
		for(let k in searchwords) {
			if(searchwords[k]) {
				data[k] = searchwords[k]
			}
		}
		this.requestList(menuId, data)
		window.scrollTo(0, 0)
	}
	handleSearch = (values) => {
		const {menuId} = this.state
		this.requestList(menuId, values)
		this.setState({
			searchwords: values
		})
	}
	showAlert = (code, e) => {
		e.stopPropagation()
		const alertInstance = alert('删除操作', '确认删除这条记录吗???', [{
				text: '取消'
			},
			{
				text: '确认',
				onPress: () => this.handelDelete(code)
			},
		]);
		setTimeout(() => {
			// 可以调用close方法以在外部close
			alertInstance.close();
		}, 10000);
	};
	handelDelete = (code) => {
		const {menuId} = this.state
		Super.super({
			url: `api2/entity/curd/remove/${menuId}`,
			data: {
				codes: code
			}
		}).then((res) => {
			this.setState({
				loading: false,
				Loading: false
			})
			if(res.status === "suc") {
				Toast.success("删除成功！") //刷新列表 
				this.requestList(menuId,code)
			} else {
				Toast.info('删除失败！')
			}
		})
	}
	seeTotal=()=>{
        const {queryKey,isSeeTotal}=this.state
        if(!isSeeTotal){
            Super.super({
                url:`api2/entity/curd/get_entities_count/${queryKey}`,                
            }).then((res)=>{
                this.setState({
                    isSeeTotal:res.count
                })
            })
        }       
    }
	render() {
		const {menuTitle,list,showDrawer,searchList,optArr,pageInfo,animating,isSeeTotal,isUnClickAble} = this.state
		const data =Storage.menuList
		const actPop = [
			(<Itempop key="5" value="home" icon={<span className="iconfont">&#xe62f;</span>}>首页</Itempop>),
			(<Itempop key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Itempop>),
			(<Itempop key="3" value="search" icon={<span className="iconfont">&#xe72f;</span>}>筛选</Itempop>),
			(<Itempop key="4" value="create" icon={<span className="iconfont">&#xe60a;</span>}>创建</Itempop>),
			(<Itempop key="2" value="login" icon={<span className="iconfont">&#xe739;</span>}>退出</Itempop>),
		]
		const sidebar = (<SearchForm 
                            searchList={searchList} 
                            optArr={optArr} 
                            handleSearch={this.handleSearch}            
                        />);
		return(
			<div className="actTable">
            <Nav 
                title={menuTitle} 
                data={data}
                handleSelected={this.handlePop}
                pops={actPop}
                />
                <div className="topbox">                    
                    {pageInfo && pageInfo.pageNo!==1?
                    <Button size="small" inline onClick={()=>this.goPage(-1)}>
                    上一页</Button>:""}                   
                    <span className="pageNo">
						{pageInfo?`第${pageInfo.pageNo}页，`:""}
						{isSeeTotal!==undefined?`共${isSeeTotal}条`:<span onClick={this.seeTotal}>点击查看总数</span>}
                    </span>
                </div>
                {
                    list?list.map((item,index)=>{
                        return <Card key={item.code} onClick={isUnClickAble?()=>Toast.info("无详情页"):()=>this.cardClick(item.code)}>
                                    <Card.Header
										title={<span style={{color:"#ccc"}}>
											{pageInfo?((pageInfo.pageNo-1)*pageInfo.pageSize+index+1):""}
										</span>}
                                        extra={isUnClickAble?null:<span 
                                            className="iconfont" 
                                            onClick={(e)=>this.showAlert(item.code,e)}
                                            >&#xe676;</span>}
                                    />
                                    <Card.Body>
                                        <List>
                                            {item.fields?item.fields.map((it)=>{
                                                return <Item key={it.title} extra={it.value}>{it.title}&nbsp;:</Item>
                                            }):""}
                                        </List>
                                    </Card.Body>
                                </Card>
                    }):""
                }
                {pageInfo && pageInfo.pageNo<pageInfo.virtualEndPageNo?
					<Button onClick={()=>this.goPage(+1)}>点击加载下一页</Button>:
					<p className="nomoredata">没有更多了···</p>}
                <Drawer
                    className={showDrawer?"openDrawer":"shutDraw"}
                    style={{ minHeight: document.documentElement.clientHeight-45 }}
                    enableDragHandle
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={sidebar}
                    open={showDrawer}
                    position="right"
                    touch={false}
                    onOpenChange={this.onOpenChange}
                >
                &nbsp;
                </Drawer>
                <ActivityIndicator
                    toast
                    text="加载中..."
                    animating={animating}
                />
            </div>
		)
	}
}