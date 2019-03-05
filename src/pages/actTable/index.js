import React ,{ Component } from 'react'
import { Card,Button,List } from 'antd-mobile';
import Nav from './../../components/Nav'
import Super from './../../super'
import './index.css'
const Item = List.Item;

const sessionStorage=window.sessionStorage
export default class ActTable extends Component{

    state={
        menuTitle:''
    }
    componentWillMount(){
        const {menuId}=this.props.match.params;
        this.requestList(menuId)
        this.setState({
            menuId
        })
    }
    requestList=(menuId)=>{
        Super.super({
            url:`/api/entity/curd/list/${menuId}`,                
        }).then((res)=>{
            if(res){
                console.log(res)
                this.setState({
                    menuTitle:res.ltmpl.title,
                    list:res.entities,
                })
                
            }
        })
    }
    handlePop=(value)=>{
        if(value==="home"){
            this.props.history.push(`/home`)
        }else if(value==="loginOut"){
            this.props.history.push(`/login`)
        }
    }
    cardClick=(code)=>{
        const {menuId}=this.state
        this.props.history.push(`/${menuId}/${code}`)
    }
    render(){
        const { menuTitle,list }=this.state
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const btn=<div>
                    <Button size="small" type="primary" inline>详情</Button>
                    <Button size="small" type="ghost" inline>修改</Button>
                    <Button size="small" type="warning" inline>删除</Button>
                </div>
        return(
            <div className="actTable">
                <Nav 
                    title={menuTitle} 
                    data={data}
                    handleSelected={this.handlePop}
                    />
                {
                    list?list.map((item,index)=>{
                        return <Card key={item.code} onClick={()=>this.cardClick(item.code)}>
                                    <Card.Header
                                        title={btn}
                                        extra={index+1}
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
            </div>
        )
    }
}