import React, {Component} from 'react'
import { DatePicker, List, InputItem, Badge } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import MultiplePicker from './../MultiplePicker'

export default class EditList extends Component {

    initFormList = () => {
        const {formList,optionsMap,getFieldProps,isDrawer,rabcTemplateupdatable} = this.props
        const formItemList=[]; 
        if(formList.list && formList.list.length>0){
            formList.list.forEach((item,index)=>{
                const title=item.title
                const key=item.code+index
                const fieldValue=item.value
                const available=item.fieldAvailable
                const fieldName=item.name
                const validators=item.validators
                const fieldId=item.fieldId
                const type=item.type;
                if(type === "text") {
                    const TEXT= <InputItem
                        {...getFieldProps(fieldName,{
                            initialValue:fieldValue?fieldValue:"",
                            rules:validators?[{
                                required: true, message: `请选择${title}`,
                                }]:"",
                        })}
                        placeholder={`请输入${title}`}
                        key={key}
                        editable={available===false?false:true}
                        clear
                    ><Badge dot={validators?true:false}>{title}</Badge></InputItem>
                    formItemList.push(TEXT)        
                }else if(type === "decimal" || type === "int") {
                    const decimal= <InputItem
                        {...getFieldProps(fieldName,{
                            initialValue:fieldValue?fieldValue:"",
                        })}
                        type={'number'}
                        defaultValue={fieldValue}
                        placeholder={`请输入${title}`}
                        key={fieldId}
                        clear
                    >{title}</InputItem>
                    formItemList.push(decimal)
                }else if(type === "file") {
                    const files = fieldValue ? [{
                        url: fieldValue,
                        id: fieldId,
                    }] : []
                    const imgPick = <ImgBox 
                        files={files}
                        {...getFieldProps(fieldName)}
                        />
                    const File= <div key={key}>
                        <List.Item extra={imgPick}>{title}</List.Item>                            
                    </div>
                    formItemList.push(File)
                } else if(type === "select") {
                    let optdata = []
                    let dot=false//必选标记
                    if(optionsMap && fieldId) {
                        for(let k in optionsMap) {
                            if(k===fieldId.toString()) {
                               optdata.push(optionsMap[k])
                            }
                        }
                        const select=<SelectPicker 
                            formList={item}
                            optdata={optdata}
                            key={key}
                            disabled={available===false?true:false}
                            dot={dot}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                                rules:validators?[{
                                    required: true, message: `请选择${title}`,
                                }]:"",
                            })}
                        />
                        formItemList.push(select)
                    }
                }else if(type === "relation") {
                    let optdata = []
                    let dot=false//必选标记
                    optdata.push(item.relationSubdomain)
                    if(item.validators==="required"){
                        dot=true
                    }
                    const list={
                        fieldId:item.fieldId,
                        name:item.name,
                        title:item.title,
                        type:item.type,
                        validators:item.validators,
                        value:item.value
                    }
                    const relation=<SelectPicker 
                        formList={list}
                        optdata={optdata}
                        key={key}
                        disabled={available===false?true:false}
                        dot={dot}
                        {...getFieldProps(fieldName,{
                            initialValue:fieldValue?fieldValue:"",
                            rules:validators?[{
                                required: true, message: `请选择${title}`,
                            }]:"",
                        })}
                    />
                    formItemList.push(relation)
                }else if(type === "caselect") {
                    const casePicker= <CasePicker
                        formList={item}
                        {...getFieldProps(fieldName,{
                            initialValue:fieldValue?fieldValue:"",
                        })}
                    />
                    formItemList.push(casePicker)
                }else if(type === "label") {
                    const  multi=<MultiplePicker 
                        formList={item}
                        optionsMap={optionsMap?optionsMap:[]}
                        {...getFieldProps(fieldName,{
                            initialValue:fieldValue?fieldValue:"",
                        })}
                    />
                    formItemList.push(multi)
                }else if(type === "date") {
                    let time = "";
                    let time_date = ""
                    if(fieldValue) { //字符串转化为时间格式
                        time = fieldValue.replace(/-/g, "/");
                        time_date = new Date(time)
                    }
                    const date= <DatePicker   
                        extra="请选择(可选)"
                        mode="date"
                        title={`请选择${title}`}
                        key={fieldId}
                        {...getFieldProps(fieldName,{
                            initialValue:time_date,
                        })}
                        onOk={e => console.log('ok', e)}
                        onDismiss={e => console.log('dismiss', e)}
                    >
                        <List.Item arrow="horizontal">{title}</List.Item>
                    </DatePicker>
                    formItemList.push(date)
                }else if(type === "deletebtn") {
                    const deletebtn=<p className="deteleLine" key={key}>
                        {!isDrawer && rabcTemplateupdatable?<span 
                            className="iconfont" 
                            style={{float:"left",top:"5px",left:'10px'}}
                            onClick={this.props.editTemplate}
                            >&#xe8ae;</span>:null}
                        <span 
                            className="iconfont" 
                            style={{float:"right",top:"0"}}
                            onClick={this.props.deleteList}
                            >&#xe676;</span>
                    </p>
                    formItemList.unshift(deletebtn)
                }
            })
        }
        return formItemList;
    }
    render(){
        return (
            this.initFormList()
        )
    }
}