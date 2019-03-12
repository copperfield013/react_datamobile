import React ,{ Component } from 'react'
import { DatePicker,List,InputItem,Picker  } from 'antd-mobile';
import CasePicker from './../CasePicker'

const seasons = [
    [
      {
        label: '男',
        value: '男',
      },{
        label: '女',
        value: '女',
      },{
        label: '拥有书籍',
        value: '拥有书籍',
      },
    ]
]
export default class SearchCard extends Component{
    
    state={
        optdata:[]       
    }    
    onVisibleChange=()=>{
        let optdata=[]       
        const {formList,optArr}=this.props
        const {fieldId}=formList
        if(optArr && optArr.length>0){
            optArr.map((item)=>{
                for(let k in item){
                    if(k.indexOf(fieldId)>-1){
                        item[k].map((it)=>{
                            it["label"]=it.title
                            return false
                        })
                        optdata.push(item[k])
                    }
                }
                return false
            })
        }
        this.setState({
            optdata
        })
    }
    initFormList=()=>{
        const {formList,getFieldProps}=this.props
        const {optdata}=this.state
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
                return <Picker
                            extra="请选择(可选)"                                       
                            data={optdata&&optdata.length>0?optdata:seasons}
                            title={`请选择${title}`}
                            cols={1}
                            cascade={false}
                            key={fieldId}
                            {...getFieldProps(field)}
                            onVisibleChange={this.onVisibleChange}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </Picker>
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