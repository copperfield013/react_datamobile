import React ,{ Component } from 'react'
import { DatePicker,List,InputItem,  } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import MultiplePicker from './../MultiplePicker'
import RelationPicker from './../RelationPicker'

export default class FormCard extends Component{
    
    state={

    }
    initFormList=()=>{
        const { getFieldProps,formList,optArr } = this.props
        
        if(formList){
            const fieldName=formList.fieldName
            const fieldValue=formList.value
            const title=formList.title
            const fieldId=formList.fieldId
            if(formList.type==="text"){
                return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            editable={formList.available===false?false:true}
                            clear
                        >{title}</InputItem>                           
            }else if(formList.type==="select"){
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
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                        />
                }               
            }else if(formList.type==="date"){
                let time="";
                let time_date=""
                if(fieldValue){ //字符串转化为时间格式
                    time= fieldValue.replace(/-/g,"/");
                    time_date = new Date(time)
                }
                return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:time_date
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </DatePicker>
            }else if(formList.type==="caselect"){
                return <CasePicker
                            formList={formList}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            />
            }else if(formList.type==="decimal" ||formList.type==="int"){
                return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            type={'number'}
                            defaultValue={fieldValue}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>
            }else if(formList.type==="label"){
                return <MultiplePicker 
                            formList={formList}
                            optArr={optArr?optArr:[]}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                        />
            }else if(formList.type==="file"){
                const files=fieldValue?[{
                    url:`/file-server/${fieldValue}`,
                    id: fieldId,
                }]:[]
                const imgPick=<ImgBox 
                                files={files}
                                {...getFieldProps(fieldName,{
                                    initialValue:fieldValue?fieldValue:""
                                })}
                                />
                return <div>
                            <List.Item extra={imgPick}>{title}</List.Item>                            
                        </div>               
            }else if(formList.type==="relation"){
                return <RelationPicker
                            formList={formList}
                            optArr={optArr?optArr:[]}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                        />
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
