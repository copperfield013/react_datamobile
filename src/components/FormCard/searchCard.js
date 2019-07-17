import React, {Component} from 'react'
import { DatePicker, List, InputItem, Picker, } from 'antd-mobile';
import CasePicker from './../CasePicker'

export default class SearchCard extends Component {

	state = {
		optdata: []
	}
	onVisibleChange = (visible) => {
		if(visible) {
			document.addEventListener('touchmove', this.bodyScroll, {
				passive: false
			})
		} else {
			document.removeEventListener('touchmove', this.bodyScroll, {
				passive: false
			})
		}
	}
	bodyScroll = (e) => {
		e.preventDefault();
	}
	initFormList = () => {
		const {formList,getFieldProps,optArr} = this.props
		if(formList) {
			const title = formList.title
			const fieldId = formList.fieldId
			const field = `criteria_${formList.id}`;
			if(formList.inputType === "text") {
				return <InputItem
                            {...getFieldProps(field)}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>
			} else if(formList.inputType === "select") {
				let optdata=[]
				if(JSON.stringify(optArr) !== "{}"){
					for(let k in optArr) {
						if(k===formList.fieldId.toString()) {
							optArr[k].forEach((it)=>{
								it.label=it.title
							})
							optdata.push(optArr[k])
						}
					}
				}
				return <Picker
							extra="请选择(可选)"                                       
							data={optdata}
							title={`请选择${title}`}
							cols={1}
							cascade={false}
							key={fieldId}
							value={formList.value?[formList.value]:[]}
							onVisibleChange={this.onVisibleChange}
							{...getFieldProps(field)}
						>
							<List.Item arrow="horizontal">{title}</List.Item>
						</Picker>
			} else if(formList.inputType === "date") {
				return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(field)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </DatePicker>
			} else if(formList.inputType === "caselect") {
				return <CasePicker
                            formList={formList}
                            />
			} else if(formList.inputType === "decimal" || formList.inputType === "int") {
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
	render() {
		return(
			<div className="formcard">
                {this.initFormList()}                
            </div>
		)
	}
}