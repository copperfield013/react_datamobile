import React ,{ Component } from 'react'
import { DatePicker,List,InputItem,  } from 'antd-mobile';
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import { createForm } from 'rc-form';

class SearchCard extends Component{
    
    state={

    }    
    initFormList=()=>{
        const { getFieldProps} = this.props.form;
        const {formList,optArr}=this.props
        if(formList){
            const title=formList.title
            const fieldId=formList.fieldId
            const field=`criteria_${fieldId}`;
            if(formList.inputType==="text"){
                return <InputItem
                            {...getFieldProps(field)}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>                           
            }else if(formList.inputType==="select"){
                return <SelectPicker 
                            formList={formList}
                            optArr={optArr?optArr:[]}
                        />
            }else if(formList.inputType==="date"){
                let time="";
                let time_date=""
                return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(field)}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
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
export default createForm()(SearchCard);