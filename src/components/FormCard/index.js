import React ,{ Component } from 'react'
import { createForm } from 'rc-form';
import { Picker, DatePicker, Popover,List,InputItem,ActionSheet } from 'antd-mobile';
import ImgBox from './../ImgBox'
import SelectPicker from './../SelectPicker'
const Item = Popover.Item;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcOffset = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
export default class FormCard extends Component{
    
    state={
        data:"",
        dpValue: now,
        idt: utcOffset.toISOString().slice(0, 10),
    }
    showActionSheet = (title) => {
        const BUTTONS = ['Operation1', 'Operation2', 'Operation2', 'Delete', 'Cancel'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          destructiveButtonIndex: BUTTONS.length - 2,
          // title: 'title',
          message: `请选择${title}`,
          maskClosable: true,
          wrapProps,
        },
        (buttonIndex) => {
          this.setState({ clicked: BUTTONS[buttonIndex] });
        });
      }
    initFormList=()=>{
        const { getFieldProps } = this.props
        const formList=this.props.data;
        const seasons = [
            [
              {
                label: '男',
                value: '男',
              },{
                label: '女',
                value: '女',
              },{
                label: '拥有书籍',
                value: '拥有书籍',
              },
            ]
        ]
        
        if(formList){
            const fieldName=formList.fieldName
            const fieldValue=formList.value
            const title=formList.title
            const fieldId=formList.fieldId
            if(formList.type==="text"){
                return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>                           
            }else if(formList.type==="select"){
                return <SelectPicker 
                            data={seasons}
                            title={title}
                            fieldId={fieldId}
                            fieldValue={fieldValue}
                            getFieldProps={getFieldProps}
                        />
            }else if(formList.type==="date"){
                return <DatePicker   
                            extra="请选择(可选)"
                            mode="date"
                            title={`请选择${title}`}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </DatePicker>
            }else if(formList.type==="caselect"){
                let arrVal=[]
                if(fieldValue){
                    arrVal=fieldValue.split("->")
                }
                return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:"",
                            })}
                            onClick={()=>this.showActionSheet(title)}
                            placeholder={`请选择${title}`}
                            key={fieldId}
                        >{title}</InputItem>
            }else if(formList.type==="decimal" ||formList.type==="int"){
                return <InputItem
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            type={'number'}
                            defaultValue={fieldValue}
                            placeholder={`请输入${title}`}
                            key={fieldId}
                            clear
                        >{title}</InputItem>
            }else if(formList.type==="label"){
                return <Picker    
                            extra="请选择(可选)"                                      
                            data={seasons}
                            title={`请选择${title}`}
                            cols={3}
                            key={fieldId}
                            {...getFieldProps(fieldName,{
                                initialValue:fieldValue?fieldValue:""
                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                        >
                            <List.Item arrow="horizontal">{title}</List.Item>
                        </Picker>
            }else if(formList.type==="file"){
                const files=fieldValue?[{
                    url:`/file-server/${fieldValue}`,
                    id: fieldId,
                }]:[]
                const imgPick=<ImgBox 
                                files={files}
                                />
                return <div>
                            <List.Item extra={imgPick}>{title}</List.Item>                            
                        </div>               
                        }
            
        }
    }
    render(){
        return (
            <div>
                {this.initFormList()}
            </div>
        )
    }
}
