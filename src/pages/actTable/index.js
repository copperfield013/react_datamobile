import React ,{ Component } from 'react'
import { Card,Button,List,Popover,Drawer,Toast,ActivityIndicator } from 'antd-mobile';
import Nav from './../../components/Nav'
import Super from './../../super'
import superagent from 'superagent'
import Units from './../../units'
import SearchForm from './../../components/SearchForm'
import './index.css'
const Item = List.Item;
const Itempop = Popover.Item;

const sessionStorage=window.sessionStorage
export default class ActTable extends Component{

    state={
        menuTitle:'',
        showDrawer:false,
        searchList:[],
        optArr:[],
        animating:false,
    }
    componentWillMount(){
        const {menuId}=this.props.match.params;
        this.requestList(menuId)
        this.setState({
            menuId
        })
    }
    componentWillUnmount(){
        clearTimeout(this.closeTimer);
    }
    requestList=(menuId,data)=>{
        this.setState({ animating:true});
        if(data && data["pageNo"] && data["pageSize"]){
            const pn=data["pageNo"]
            const ps=data["pageSize"]
            this.props.history.push(`/${menuId}?pageNo=${pn}&pageSize=${ps}`)
        }
        Super.super({
            url:`/api/entity/curd/list/${menuId}`, 
            data:data              
        }).then((res)=>{
            this.setState({ animating:false});
            if(res){
                //console.log(res)
                this.setState({
                    menuTitle:res.ltmpl.title,
                    list:res.entities,
                    searchList:res.criterias,
                    pageInfo:res.pageInfo,
                    showDrawer:false,
                })            
            }
        })
    }
    handlePop=(value)=>{
        const {menuId}=this.state
        if(value==="home"){
            this.props.history.push(`/home`)
        }else if(value==="user"){
            this.props.history.push(`/user`)
        }else if(value==="loginOut"){
            this.props.history.push(`/login`)
        }else if(value==="search"){
            this.onOpenChange()
            this.getSearchOptions()
        }else if(value==="create"){
            this.props.history.push(`/create/${menuId}`)
        }
    }
    getSearchOptions=()=>{
        const {searchList}=this.state;
        const searchId=[]
        if(searchList){
            searchList.map((item)=>{
                if(item.inputType==="select"){
                    searchId.push(item.fieldId)
                }
                return false
            })
        }
        if(searchId.length>0){
            const optArr=[]
            const formData = new FormData();
            const tokenName=Units.getLocalStorge("tokenName")
            searchId.map((item)=>{
                formData.append('fieldIds',item);
                return false
            })
            superagent
                .post(`/api/field/options`)
                .set({"datamobile-token":tokenName})
                .send(formData)
                .end((req,res)=>{
                    if(res.status===200){                                          
                        optArr.push(res.body.optionsMap)
                        this.setState({
                            optArr
                        })
                    }else if(res.status===403){
                        Toast.info("请求权限不足,可能是token已经超时")
                        window.location.href="/#/login";
                    }else if(res.status===404||res.status===504){
                        Toast.info("服务器未开···")
                    }else if(res.status===500){
                        Toast.info("后台处理错误。")
                    }
                })
        }
    }
    cardClick=(code)=>{
        const {menuId}=this.state
        this.props.history.push(`/${menuId}/${code}`)
    }
    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ showDrawer:!this.state.showDrawer});
        // if(!showDrawer){ //抽屉打开
        //     this.loadSourchList()
        // }
    }
    goPage=(no)=>{
        const {pageInfo,menuId}=this.state
        let data={}
        const topageNo=pageInfo.pageNo+no    
        data["pageNo"]=topageNo
        data["pageSize"]=pageInfo.pageSize
        this.requestList(menuId,data)
        window.scrollTo(0, 0)
    }
    handleSearch=(values)=>{
        const {menuId}=this.state
        this.requestList(menuId,values)
    }
    menuOpen=(menuId)=>{
        this.requestList(menuId)
    }
    render(){
        const { menuTitle,list,showDrawer,searchList,optArr,pageInfo,animating }=this.state
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const totalPage=pageInfo?Math.ceil(pageInfo.count/pageInfo.pageSize):""
        const btn=<div>
                    <Button size="small" type="primary" inline>详情</Button>
                    <Button size="small" type="ghost" inline>修改</Button>
                    <Button size="small" type="warning" inline>删除</Button>
                </div>
        
        const actPop=[      
            (<Itempop key="5" value="home" icon={<span className="iconfont">&#xe62f;</span>}>首页</Itempop>),
            (<Itempop key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Itempop>),
            (<Itempop key="3" value="search" icon={<span className="iconfont">&#xe72f;</span>}>筛选</Itempop>),
            (<Itempop key="4" value="create" icon={<span className="iconfont">&#xe60a;</span>}>创建</Itempop>),
            (<Itempop key="6" value="export" icon={<span className="iconfont">&#xe7ea;</span>}>导出</Itempop>),  
            (<Itempop key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Itempop>),
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
                menuOpen={this.menuOpen}
                />
                <div className="topbox">                    
                    {pageInfo && pageInfo.pageNo!==1?<Button size="small" inline onClick={()=>this.goPage(-1)}>上一页</Button>:""}                   
                    <span className="pageNo">
                        {pageInfo?`第${pageInfo.pageNo}页，共${pageInfo.count}条`:""}
                    </span>
                </div>
                {
                    list?list.map((item,index)=>{
                        return <Card key={item.code} onClick={()=>this.cardClick(item.code)}>
                                    <Card.Header
                                        title={btn}
                                        extra={pageInfo?((pageInfo.pageNo-1)*pageInfo.pageSize+index+1):""}
                                    />
                                    <Card.Body>
                                        <List>
                                            {item.fields?item.fields.map((it)=>{
                                                return <Item key={it.id} extra={it.value}>{it.title}&nbsp;:</Item>
                                            }):""}
                                        </List>
                                    </Card.Body>
                                </Card>
                    }):""
                }
                {pageInfo&&totalPage>=(pageInfo.pageNo+1)?<Button onClick={()=>this.goPage(+1)}>点击加载下一页</Button>:<p className="nomoredata">没有更多了···</p>}
                <Drawer
                    className={showDrawer?"openDrawer":"shutDraw"}
                    style={{ minHeight: document.documentElement.clientHeight-45 }}
                    enableDragHandle
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={sidebar}
                    open={showDrawer}
                    position="right"
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