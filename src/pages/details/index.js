import React ,{ Component } from 'react'
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'

const sessionStorage=window.sessionStorage
class Details extends Component{

    state={
        itemList:[],
    }
    componentWillMount(){
        const {menuId,code}=this.props.match.params
        this.setState({
            menuId,
            code,
        })
        this.loadRequest(menuId,code)
    }
    loadRequest=(menuId,code)=>{
        const URL=code?`/api/entity/curd/detail/${menuId}/${code}`:`/api/entity/curd/dtmpl/${menuId}`
        Super.super({
            url:URL,         
        }).then((res)=>{       
            console.log(res)
            if(res && res.entity){
                this.setState({
                    itemList:res.entity.fieldGroups
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
    render(){      
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const { getFieldProps } = this.props.form;
        const {itemList}=this.state
        return (
            <div>
                <Nav 
                    title={`详情-`}
                    data={data}
                    handleSelected={this.handlePop}
                    />
                <div>
                    {
                        itemList.map((item)=>{
                            return <List renderHeader={() => item.title} key={item.id}>
                                        {
                                            item.fields?item.fields.map((it)=>{
                                                const fieldName=it.fieldName
                                                const fieldValue=it.value
                                                const title=it.title
                                                const fieldId=it.fieldId
                                                return <InputItem
                                                            {...getFieldProps(fieldName)}
                                                            defaultValue={fieldValue}
                                                            placeholder={`请输入${title}`}
                                                            key={fieldId}
                                                            clear
                                                        >{title}</InputItem>
                                            }):
                                            item.array?item.array.map((it)=>{
                                                return it.fields.map((i)=>{
                                                            const fieldName=i.fieldName
                                                            const fieldValue=i.value
                                                            const title=i.title
                                                            const fieldId=i.fieldId
                                                            return <InputItem
                                                                    {...getFieldProps(fieldName)}
                                                                    defaultValue={fieldValue}
                                                                    placeholder={`请输入${title}`}
                                                                    key={fieldId}
                                                                    clear
                                                                >{title}</InputItem>
                                                        })
                                            }):""
                                        }
                                    </List>
                        })
                    }
                </div>
            </div>
        )
    }
}
export default createForm()(Details);