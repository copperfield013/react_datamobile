import React ,{ Component } from 'react'
import { createForm } from 'rc-form';
import { Picker, DatePicker, Popover,List,InputItem } from 'antd-mobile';
const Item = Popover.Item;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcOffset = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
class FormCard extends Component{
    
    state={
        data:"",
        dpValue: now,
        idt: utcOffset.toISOString().slice(0, 10),
    }
    initFormList=()=>{
        const { getFieldProps } = this.props
        const formList=this.props.data;
        console.log(formList)
        const seasons = [
            [
              {
                label: '男',
                value: '男',
              },{
                label: '女',
                value: '女',
              },
            ]
        ]
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
                return <Picker   
                            extra="请选择(可选)"                                       
                            data={seasons}
                            title={`请选择${title}`}
                            cols={1}
                            cascade={false}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?[fieldValue]:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </Picker>
            }else if(formList.type==="date"){
                return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </DatePicker>
            }else if(formList.type==="caselect"){
                return <Picker    
                            extra="请选择(可选)"                                      
                            data={seasons}
                            title={`请选择${title}`}
                            cols={3}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </Picker>
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
                return <Picker    
                            extra="请选择(可选)"                                      
                            data={seasons}
                            title={`请选择${title}`}
                            cols={3}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </Picker>
            }
            
        }
    }
    render(){
        return (
            <div>
                {this.initFormList()}
            </div>
        )
    }
}
export default createForm()(FormCard);