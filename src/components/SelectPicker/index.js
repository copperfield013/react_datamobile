import React, {Component} from 'react'
import { Picker, List, Badge } from 'antd-mobile';

export default class SelectPicker extends Component {

	state = {
		optdata: []
	}
	handleOk = (e) => {
		let {formList} = this.props
		formList.value = e[0]
		this.triggerChange(...e);
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if(onChange) {
			onChange(changedValue);
		}
	}
	bodyScroll = (e) => {
		e.preventDefault();
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
	render() {
		const {formList,disabled,optdata,dot} = this.props
		const {title,fieldId,value} = formList
		return(
			<div>
                <Picker
                    extra="请选择(可选)"                                       
                    data={optdata}
                    title={`请选择${title}`}
                    cols={1}
                    cascade={false}
                    key={fieldId}
                    disabled={disabled}
                    value={value?[value]:[]}
                    onVisibleChange={this.onVisibleChange}
                    onOk={e=>this.handleOk(e)}
                >
                    <List.Item arrow="horizontal"><Badge dot={dot}>{title}</Badge></List.Item>
                </Picker>
            </div>
		)
	}
}