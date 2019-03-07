import React ,{ Component } from 'react'
import { Modal,Button,Tag,Radio,InputItem,List } from 'antd-mobile';
import Super from './../../super'
import './index.css'
import Units from './../../units'
const RadioItem = Radio.RadioItem;

export default class CasePicker extends Component{

    state={
        modal2: false,
        caseList:"",
        changeselset:0,
        radiotvalue:"",
        changeTag:false,
        ikey:[]
    }
    showModal = (key,caseList) => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        const optGroupId=caseList.optionKey.split("@")[0]
        const num=caseList.optionKey.split("@")[1]
        this.setState({
            [key]: true,
            caseList,
            changeselset:0,
            radiokey:"",
            num,
            radiotvalue:"",
        });
        this.getcaseList(optGroupId)
    }
    
    getcaseList=(optionKey)=>{
        let {ikey}=this.state
        if(typeof optionKey==="string"){
            ikey.push(parseInt(optionKey))
        }else{
            ikey.push(optionKey)
        }       
        ikey=Units.uniq(ikey).sort((a,b)=>a-b)
        Super.super({
			url:`/api/field/cas_ops/${optionKey}`,                
		}).then((res)=>{
			const ops=[]
            res.options.map((item)=>{
                const op={}
                op["value"]=item.title
                op["label"]=item.title
                op["key"]=item.id
                ops.push(op)
                return false
            })
            this.setState({
                options:ops,
                ikey
            })
		})
    }
    onClose = key => () => {
        this.setState({
          [key]: false,
        });
      }
    onChangeTag=(selected,index,radiokey)=> {
        const {radiotvalue}=this.state
        const arr=radiotvalue.split("->")
        const arr2=[]
        let res=""
        if(index>0){   //点击tag.删除点击tag之后的数据
            for(let i=0;i<index;i++){
                arr2.push(arr[i])
            }
            res=arr2.join("->")
        }
        this.setState({
            changeselset:index,
            changeTag:true,
            radiotvalue:res,
        })   
        this.getcaseList(radiokey)
    }
    onRadioChange=(radiokey,radiovalue) => {
        let {caseList,radiotvalue,num,changeselset,ikey}=this.state
        if(radiotvalue){
            caseList.value=radiotvalue+"->"+radiovalue
            radiotvalue=caseList.value
        }else{
            caseList.value=radiovalue
            radiotvalue=radiovalue
        }
        if(radiotvalue.split("->").length<num){
            this.getcaseList(radiokey)
        }       
        this.setState({
            radiokey,
            radiotvalue,
            caseList,
            changeselset:changeselset+1,
            ikey,
        });
    };
    render(){
        const { formList }=this.props
        const {caseList,changeselset,modal2,options,radiokey,changeTag,ikey}=this.state
        let ss=[]
        if(caseList && caseList.value){
            ss=caseList.value.split("->")
            ss=Units.uniq(ss)
        }
        return (
            <div>
                <InputItem
                    value={formList.value}
                    onClick={this.showModal('modal2',formList)}
                    placeholder={`请选择${formList.title}`}
                    key={formList.fieldId}
                >{formList.title}</InputItem>
                <Modal
                    popup
                    visible={modal2}
                    onClose={this.onClose('modal2')}
                    animationType="slide-up"
                   // afterClose={() => { alert('afterClose'); }}
                    >
                    <List renderHeader={() => <div>{`请选择${caseList.title}`}</div>} className="popup-list">
                    <List.Item>
                        <div className="tag">
                            {ss.map((item,index)=>(
                                <Tag 
                                    selected={changeTag?(index===changeselset?true:false):false} //判断点击是否为当前
                                    onChange={(selected) => {this.onChangeTag(selected, index,ikey[index])}} 
                                    key={index}
                                    disabled={index>changeselset?true:false}
                                    >
                                    {item}
                                </Tag>
                            ))}
                        </div>
                        </List.Item>
                        <div className="rediobox">
                            {options?options.map(i => (
                                <RadioItem key={i.key} checked={radiokey === i.key} onChange={() => this.onRadioChange(i.key,i.value)}>
                                    {i.label}
                                </RadioItem>
                            )):""}
                        </div>
                        <List.Item>
                            <Button type="primary" onClick={this.onClose('modal2')}>确定</Button>
                        </List.Item>
                    </List>
                </Modal>
            </div>
        )
    }
}
    