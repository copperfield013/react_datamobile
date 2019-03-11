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
                            clear
                        >{title}</InputItem>                           
            }else if(formList.type==="select"){
                return <SelectPicker 
                            formList={formList}
                            optArr={optArr?optArr:[]}
                        />
            }else if(formList.type==="date"){
                let time="";
                let time_date=""
                if(fieldValue){
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
                        />
            }else if(formList.type==="file"){
                const files=fieldValue?[{
                    url:`/file-server/${fieldValue}`,
                    id: fieldId,
                }]:[]
                const imgPick=<ImgBox 
                                files={files}
                                />
                return <div>
                            <List.Item extra={imgPick}>{title}</List.Item>                            
                        </div>               
            }else if(formList.type==="relation"){
                return <RelationPicker
                            formList={formList}
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
