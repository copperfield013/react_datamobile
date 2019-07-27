import React, {Component} from 'react'
import { Modal, Button, Checkbox, InputItem, List } from 'antd-mobile';
import './index.less'
const CheckboxItem = Checkbox.CheckboxItem;

export default class MultiplePicker extends Component {

	state = {
		vismodal: false,
	}
	bodyScroll = (e) => {
		e.preventDefault();
	}
	showModal = (formList) => (e) => {
		document.addEventListener('touchmove', this.bodyScroll, {
			passive: false
		})
		const {optionsMap} = this.props
		const {fieldId,value} = formList
		let optdata = []
		if(optionsMap) {
			for(let k in optionsMap) {
				if(k===fieldId.toString()) {
					optionsMap[k].forEach((it) => {
						it["label"] = it.title
						it["checked"] = false
					})
					optdata = optionsMap[k]
				}
			}
		}
		if(value) {
			const arrvalue = value.split(",")
			optdata.forEach((item) => {
				arrvalue.forEach((it) => {
					if(item.value === it) {
						item["checked"] = true
					}
				})
			})
		}
		this.setState({
			optdata,
			vismodal: true,
		})
	}
	onClose = () => {
		document.removeEventListener('touchmove', this.bodyScroll, {
			passive: false
		})
		this.setState({
			vismodal: false,
		});
	}
	onCloseMul = () => {
		const {optdata} = this.state
		let {formList} = this.props
		const res = []
		optdata.forEach((item) => {
			if(item.checked) {
				res.push(item.value)
			}
		})
		formList.value = res.join(",")
		this.triggerChange(formList.value);
		this.onClose()
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if(onChange) {
			onChange(changedValue);
		}
	}
	onChange = (value) => {
		const {optdata} = this.state
		optdata.forEach((item) => {
			if(item.value === value) {
				item.checked = !item.checked
			}
		})
		this.setState({
			optdata
		})
	}
	render() {
		const {formList} = this.props
		const {optdata,vismodal} = this.state
		const {title,fieldId,value} = formList
		return(
			<div>
                <InputItem
                    value={value}
                    onClick={this.showModal(formList)}
                    placeholder={`请选择${title}`}
                    key={fieldId}
                    editable={false}
                >{title}</InputItem>
                <Modal
                    popup
                    visible={vismodal}
                    onClose={this.onClose}
                    animationType="slide-up"
                    >
                    <List renderHeader={() => <div>{`请选择${title}`}</div>} className="popup-list">
                        <div className="checkbox">
                            {optdata?optdata.map(i => 
                                <CheckboxItem  
                                    key={i.label} 
                                    onChange={() => this.onChange(i.value)} 
                                    defaultChecked={i.checked}
                                    >
                                    {i.label}
                                </CheckboxItem>
                            ):""}
                        </div>
                        <List.Item>
                            <Button type="primary" onClick={this.onCloseMul}>确定</Button>
                        </List.Item>
                    </List>
                </Modal>
            </div>
		)
	}
}