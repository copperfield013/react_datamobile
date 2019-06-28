import React, {Component} from 'react'
import { DatePicker, List, InputItem, Badge } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import MultiplePicker from './../MultiplePicker'

export default class EditList extends Component {

    initFormList = () => {
        const {formList,optionsMap,getFieldProps} = this.props
        const formItemList=[]; 
        if(formList.list && formList.list.length>0){
            formList.list.map((item,index)=>{
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
                } else if(type === "select" || type === "relation") {
                    let optdata = []
                    let list=formList
                    let dot=false//必选标记
                    if(optionsMap && fieldId) {
                        for(let k in optionsMap) {
                            if(k===fieldId.toString()) {
                                optionsMap[k].map((it) => {
                                    it["label"] = it.title
                                    return false
                                })
                                optdata.push(optionsMap[k])
                            }
                        }
                        if(formList.list){
                            formList.list.map((it)=>{
                                if(it.type === "relation"){
                                    optdata.push(it.relationSubdomain)
                                    if(it.validators==="required"){
                                        dot=true
                                    }
                                    list={
                                        fieldId:it.fieldId,
                                        name:it.name,
                                        title:it.title,
                                        type:it.type,
                                        validators:it.validators,
                                        value:it.value
                                    }
                                }
                                return false
                            })
                        }
                        const select=<SelectPicker 
                                        formList={list}
                                        optdata={optdata}
                                        key={key}
                                        disabled={formList.available===false?true:false}
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
                }else if(type === "caselect") {
                    const casePicker= <CasePicker
                                formList={formList}
                                {...getFieldProps(fieldName,{
                                    initialValue:fieldValue?fieldValue:"",
                                })}
                                />
                    formItemList.push(casePicker)
                }else if(type === "label") {
                    const  multiplePicker=<MultiplePicker 
                                                formList={formList}
                                                optionsMap={optionsMap?optionsMap:[]}
                                                {...getFieldProps(fieldName,{
                                                    initialValue:fieldValue?fieldValue:"",
                                                })}
                                            />
                    formItemList.push(multiplePicker)
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
                                        <span 
                                            className="iconfont" 
                                            style={{float:"right",top:"0"}}
                                            onClick={this.props.deleteList}
                                            >&#xe676;</span>
                                    </p>
                    formItemList.unshift(deletebtn)
                }
                return false
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