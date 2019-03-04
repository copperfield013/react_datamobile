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
    }
    requestList=(menuId)=>{
        Super.super({
            url:`/api/entity/curd/list/${menuId}`,                
        }).then((res)=>{
            if(res){
                console.log(res)
                res.entities.fields.map((item)=>{
                    
                })
            }
            this.setState({
                menuTitle:res.ltmpl.title
            })
        })
    }
    render(){
        const {menuTitle}=this.state
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const btn=<div>
                    <Button size="small" type="primary" inline>详情</Button>
                    <Button size="small" type="ghost" inline>修改</Button>
                    <Button size="small" type="warning" inline>删除</Button>
                </div>
        return(
            <div className="actTable">
                <Nav title={menuTitle} data={data}/>
                <Card>
                    <Card.Header
                        title={btn}
                        extra="1"
                    />
                    <Card.Body>
                        <List>
                            <Item extra={'extra content'}>Title</Item>
                        </List>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}