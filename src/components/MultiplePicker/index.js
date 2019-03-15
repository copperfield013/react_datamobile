import React ,{ Component } from 'react'
import { Modal,Button,Checkbox,InputItem,List } from 'antd-mobile';
import './index.css'
const CheckboxItem = Checkbox.CheckboxItem;

export default class MultiplePicker extends Component{

    state={
        vismodal:false,
    }
    showModal = (formList) => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        const {optArr}=this.props
        const {fieldId,value}=formList     
        let optdata=[] 
        if(optArr && optArr.length>0){
            optArr.map((item)=>{
                for(let k in item){
                    if(k.indexOf(fieldId)>-1){
                        item[k].map((it)=>{
                            it["label"]=it.title
                            it["checked"]=false
                            return false
                        })
                        optdata=item[k]
                    }
                }
                return false
            })
        }
        if(value){
            const arrvalue=value.split(",")
            optdata.map((item)=>{
                arrvalue.map((it)=>{
                    if(item.value===it){
                        item["checked"]=true
                    }
                    return false
                })
                return false
            })
        }       
        this.setState({
            optdata,
            vismodal: true,
        })
    }
    onClose = () => {
        this.setState({
            vismodal: false,
          });
    }
    onCloseMul = () => {
        const {optdata}=this.state
        let { formList }=this.props
        const res=[]
        optdata.map((item)=>{
            if(item.checked){
                res.push(item.value)
            }
            return false
        })
        formList.value=res.join(",")
        this.triggerChange(formList.value);
        this.onClose()
    }
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
          onChange(changedValue);
        }
      }
    onChange=(value)=>{
        const {optdata}=this.state  
        optdata.map((item)=>{
            if(item.value===value){
                item.checked=!item.checked
            }
            return false
        })
        this.setState({optdata})
    }
    render(){
        const { formList }=this.props
        const {optdata,vismodal}=this.state  
        const {title,fieldId,value}=formList   
        return (
            <div>
                <InputItem
                    value={value}
                    onClick={this.showModal(formList)}
                    placeholder={`请选择${title}`}
                    key={fieldId}
                >{title}</InputItem>
                <Modal
                    popup
                    visible={vismodal}
                    onClose={this.onClose}
                    animationType="slide-up"
                    >
                    <List renderHeader={() => <div>{`请选择${title}`}</div>} className="popup-list">
                        <div className="checkbox">
                            {optdata?optdata.map(i => (
                                <CheckboxItem  
                                    key={i.label} 
                                    onChange={() => this.onChange(i.value)} 
                                    defaultChecked={i.checked}
                                    >
                                    {i.label}
                                </CheckboxItem>
                            )):""}
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
    