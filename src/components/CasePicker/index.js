import React, { Component } from 'react'
import { Modal, Button, Tag, Radio, InputItem, List } from 'antd-mobile';
import Super from './../../super'
import './index.less'
import Units from './../../units'
const RadioItem = Radio.RadioItem;

export default class CasePicker extends Component {

	state = {
		caseModal: false,
		caseList: "",
		changeselset: 0,
		radiotvalue: "",
		changeTag: false,
		ikey: [],
		tagStr: []
	}
	showModal = (formList) => (e) => {
		console.log(formList)
		document.addEventListener('touchmove', this.bodyScroll, {
			passive: false
		})
		let caseList = formList.value
		let {tagStr} = this.state
		const optGroupId = formList.optionGroupKey.split("@")[0]
		const num = formList.optionGroupKey.split("@")[1]
		if(caseList) {
			tagStr = caseList.split("->")
			tagStr = Units.uniq(tagStr)
		}
		this.setState({
			caseModal: true,
			caseList,
			changeselset: 0,
			radiokey: "",
			num,
			radiotvalue: "",
			tagStr,
		});
		this.getcaseList(optGroupId)
	}

	getcaseList = (optionKey) => {
		let {ikey} = this.state
		if(typeof optionKey === "string") {
			ikey.push(parseInt(optionKey))
			this.setState({
				ikey
			})
		}
		Super.super({
			url: `api2/meta/dict/cas_ops/${optionKey}`,
		}).then((res) => {
			const ops = []
			res.options.forEach((item) => {
				const op = {}
				op["value"] = item.title
				op["label"] = item.title
				op["key"] = item.id
				ops.push(op)
			})
			this.setState({
				options: ops,
			})
		})
	}
	onChangeTag = (selected, index, radiokey) => {
		let {
			radiotvalue,
			ikey
		} = this.state
		const arr = radiotvalue.split("->")
		const arr2 = []
		const keys = []
		let res = ""
		if(index > 0) { //点击tag.删除点击tag之后的数据
			for(let i = 0; i < index; i++) {
				arr2.push(arr[i])
			}
			res = arr2.join("->")
		}
		for(let i = 0; i <= index; i++) {
			keys.push(ikey[i])
		}
		this.getcaseList(radiokey)
		this.setState({
			changeselset: index,
			changeTag: true,
			radiotvalue: res,
			ikey: keys
		})
	}
	onRadioChange = (radiokey, radiovalue) => {
		let {
			caseList,
			radiotvalue,
			num,
			changeselset,
			ikey,
			tagStr
		} = this.state
		let changenum = changeselset
		if(radiotvalue) {
			if(tagStr.length === parseInt(num)) {
				const arr = radiotvalue.split("->")
				arr.splice(num - 1, 1, radiovalue)
				radiotvalue = arr.join("->")
				caseList = radiotvalue
				ikey.push(radiokey)
			} else {
				caseList = radiotvalue + "->" + radiovalue
				radiotvalue = radiotvalue + "->" + radiovalue
				ikey.push(radiokey)
				changenum++
			}
		} else {
			caseList = radiovalue
			radiotvalue = radiovalue
			ikey.push(radiokey)
			changenum++
		}
		if(caseList) {
			tagStr = caseList.split("->")
			tagStr = Units.uniq(tagStr)
		}
		if(radiotvalue.split("->").length < parseInt(num)) {
			this.getcaseList(radiokey)
		} else if(radiotvalue.split("->").length === parseInt(num)) {
			ikey.splice(parseInt(num), 1, radiokey)
		}
		ikey = Units.uniq(ikey)
		this.setState({
			radiokey,
			radiotvalue,
			caseList,
			changeselset: changenum,
			ikey,
			tagStr,
			changeTag: false
		});
	};
	onCloseCase = () => {
		let {caseList} = this.state
		let {formList} = this.props
		formList.value = caseList //最后按确定键，将值传出
		this.triggerChange(caseList);
		this.onClose()
		this.setState({
			caseList: "",
			changeselset: 0,
			radiotvalue: "",
			changeTag: false,
			ikey: [],
			tagStr: []
		})
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if(onChange) {
			onChange(changedValue);
		}
	}
	onClose = () => {
		document.removeEventListener('touchmove', this.bodyScroll, {
			passive: false
		})
		this.setState({
			caseModal: false,
		});
	}
	bodyScroll = (e) => {
		e.preventDefault();
	}
	render() {
		const {formList} = this.props
		const {changeselset,caseModal,options,radiokey,changeTag,ikey,tagStr} = this.state
		const {value,title,fieldId} = formList
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
                    visible={caseModal}
                    onClose={this.onClose}
                    animationType="slide-up"
                    afterClose={this.closeModal}
                    >
                    <List renderHeader={() => <div>{`请选择${title}`}</div>} className="popup-list">
                    <List.Item>
                        <div className="tag">
                            {tagStr.map((item,index)=>
                                <Tag 
                                    selected={changeTag?(index===changeselset?true:false):false} //判断点击是否为当前
                                    onChange={(selected) =>this.onChangeTag(selected, index,ikey[index])} 
                                    key={index}
                                    disabled={index>changeselset?true:false}
                                    >
                                    {item}
                                </Tag>
                            )}
                        </div>
                        </List.Item>
                        <div className="rediobox">
                            {options?options.map(i => 
                                <RadioItem key={i.key} checked={radiokey === i.key} onChange={() => this.onRadioChange(i.key,i.value)}>
                                    {i.label}
                                </RadioItem>
                            ):""}
                        </div>
                        <List.Item>
                            <Button type="primary" onClick={this.onCloseCase}>确定</Button>
                        </List.Item>
                    </List>
                </Modal>
            </div>
		)
	}
}