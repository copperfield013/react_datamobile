import React, {Component} from 'react'
import { DatePicker, List, InputItem, Badge } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
import CasePicker from './../CasePicker'
import MultiplePicker from './../MultiplePicker'

export default class FormCard extends Component {

	initFormList = () => {
		const {getFieldProps,formList,optionsMap} = this.props

		if(formList) {
			const fieldName = formList.name
			const fieldValue = formList.value
			const title = formList.title
            const fieldId = formList.fieldId
            const validators = formList.validators
			if(formList.type === "text") {
				return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                                rules:validators?[{
                                    required: true, message: `请选择${title}`,
                                  }]:"",
                            })}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            editable={formList.available===false?false:true}
                            clear
                        ><Badge dot={formList.validators?true:false}>{title}</Badge></InputItem>
			} else if(formList.type === "select" || formList.type === "relation") {
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
					return <SelectPicker 
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
			} else if(formList.type === "date") {
				let time = "";
				let time_date = ""
				if(fieldValue) { //字符串转化为时间格式
					time = fieldValue.replace(/-/g, "/");
					time_date = new Date(time)
				}
				return <DatePicker   
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
			} else if(formList.type === "caselect") {
				return <CasePicker
                            formList={formList}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            />
			} else if(formList.type === "decimal" || formList.type === "int") {
				return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            type={'number'}
                            defaultValue={fieldValue}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>
			} else if(formList.type === "label") {
				return <MultiplePicker 
                            formList={formList}
                            optionsMap={optionsMap?optionsMap:[]}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                        />
			} else if(formList.type === "file") {
				const files = fieldValue ? [{
					url: fieldValue,
					id: fieldId,
				}] : []
				const imgPick = <ImgBox 
                                files={files}
                                {...getFieldProps(fieldName)}
                                />
				return <div>
                            <List.Item extra={imgPick}>{title}</List.Item>                            
                        </div>
			}
		}
	}
	render() {
		return(
			<div className="formcard">
                {this.initFormList()}                
            </div>
		)
	}
}