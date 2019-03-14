import React ,{ Component } from 'react'
import { DatePicker,List,InputItem, } from 'antd-mobile';
import CasePicker from './../CasePicker'
import SelectPicker from './../SelectPicker'

export default class SearchCard extends Component{
    
    state={
        optdata:[]       
    }    
    initFormList=()=>{
        const {formList,getFieldProps,optArr}=this.props
        if(formList){
            const title=formList.title
            const fieldId=formList.fieldId
            const field=`criteria_${formList.id}`;
            if(formList.inputType==="text"){
                return <InputItem
                            {...getFieldProps(field)}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>                           
            }else if(formList.inputType==="select"){
                let optdata=[]   
                if(optArr && optArr.length>0){
                    optArr.map((item)=>{
                        for(let k in item){
                            if(k.indexOf(formList.fieldId)>-1){
                                item[k].map((it)=>{
                                    it["label"]=it.title
                                    return false
                                })
                                optdata.push(item[k])
                            }
                        }
                        return false
                    })
                    return <SelectPicker 
                            formList={formList}
                            optdata={optdata}
                            disabled={formList.available===false?true:false}
                            {...getFieldProps(field)}
                        />
                }   
            }else if(formList.inputType==="date"){
                return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(field)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </DatePicker>
            }else if(formList.inputType==="caselect"){
                return <CasePicker
                            formList={formList}
                            />
            }else if(formList.inputType==="decimal" ||formList.inputType==="int"){
                return <InputItem
                            {...getFieldProps(field)}
                            type={'number'}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>
            }          
        }
    } 
    render(){
        return (
            <div className="formcard">
                {this.initFormList()}                
            </div>
        )
    }
}