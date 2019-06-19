import React, {Component} from 'react'
import { DatePicker, List, InputItem, Badge } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import MultiplePicker from './../MultiplePicker'

export default class EditList extends Component {

    initFormList = () => {
        const {getFieldProps,formList,optionsMap} = this.props
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
                        const SelectPicker=<SelectPicker 
                                    formList={formList}
                                    optdata={optdata}
                                    disabled={formList.available===false?true:false}
                                    dot={formList.validators==="required"?true:false}
                                    {...getFieldProps(fieldName,{
                                        initialValue:fieldValue?fieldValue:"",
                                        rules:validators?[{
                                            required: true, message: `请选择${title}`,
                                          }]:"",
                                    })}
                                />
                    }
                    formItemList.push(SelectPicker)
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