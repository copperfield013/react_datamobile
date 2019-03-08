import React ,{ Component } from 'react'
import { List,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import superagent from 'superagent'
import Units from './../../units'
import './index.css'

const sessionStorage=window.sessionStorage
class Details extends Component{

    state={
        itemList:[],
        optArr:[],
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
                const selectId=[]
                res.entity.fieldGroups.map((item)=>{
                    if(item.fields){
                        item.fields.map((it)=>{
                            if(it.type==="select" || it.type==="label"){
                                selectId.push(it.fieldId)
                            }
                            return false
                        })
                    }
                    return false
                })      
                if(selectId.length>0){
                    this.requestSelect(selectId)
                }  
                // console.log(res.entity.fieldGroups)       
                // console.log(selectId)
            }
        })
    }
    requestSelect=(selectId)=>{
        const optArr=[]
        const formData = new FormData();
        const tokenName=Units.getLocalStorge("tokenName")
        selectId.map((item)=>{
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
        const {itemList,optArr}=this.state
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
                                                            formList={it}
                                                            getFieldProps={getFieldProps}
                                                            optionKey={it.optionKey}
                                                            optArr={optArr}
                                                        />
                                            })
                                            :item.array?item.array.map((it,index)=>{
                                                const marginBottom=index>0?"marginBottom":""
                                                return <div className={marginBottom} key={index}>
                                                            {
                                                                it.relation?<FormCard 
                                                                                key={it.relation} 
                                                                                formList={{
                                                                                    title: "关系",
                                                                                    type: "relation",
                                                                                    fieldName: "关系",
                                                                                    fieldId:it.relation,
                                                                                    value: key,
                                                                                    relationSubdomain:arrkey,
                                                                                }}
                                                                                //optArr={optArr}
                                                                                getFieldProps={getFieldProps}
                                                                            />  :""
                                                            }
                                                            {it.fields.map((i)=>{
                                                                    return <FormCard 
                                                                                key={i.id} 
                                                                                formList={i}
                                                                                getFieldProps={getFieldProps}
                                                                                optArr={optArr}
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