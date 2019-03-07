import React ,{ Component } from 'react'
import { List, } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import './index.css'

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
            <div className="details">
                <Nav 
                    title={`详情-`}
                    data={data}
                    handleSelected={this.handlePop}
                    />
                <div>
                    {
                        itemList.map((item)=>{
                            let key=""
                            let arrkey=[]
                            if(item.composite && item.composite.addType===5){
                                key=item.composite.relationKey;
                                arrkey=item.composite.relationSubdomain
                            }
                            return <List renderHeader={() => item.title} key={item.id}>
                                        {
                                            item.fields?item.fields.map((it)=>{
                                                return <FormCard 
                                                            key={it.id} 
                                                            data={it}
                                                            getFieldProps={getFieldProps}
                                                            optionKey={it.optionKey}
                                                        />
                                            }):
                                            item.array?item.array.map((it,index)=>{
                                                const marginBottom=index>0?"marginBottom":""
                                                return <div className={marginBottom}>
                                                            {
                                                                it.relation?<FormCard 
                                                                                key={it.relation} 
                                                                                data={{
                                                                                    title: "关系",
                                                                                    type: "select",
                                                                                    fieldName: "关系",
                                                                                    fieldId:it.relation,
                                                                                    value: key,
                                                                                    relationSubdomain:arrkey,
                                                                                }}
                                                                                getFieldProps={getFieldProps}
                                                                            />  :""
                                                            }
                                                            {it.fields.map((i)=>{
                                                                    return <FormCard 
                                                                                key={i.id} 
                                                                                data={i}
                                                                                getFieldProps={getFieldProps}
                                                                            />                                                        
                                                                })}
                                                        </div>
                                                
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