import React ,{ Component } from 'react'
import { Picker,List } from 'antd-mobile';

export default class SelectPicker extends Component{

    state={
        optdata:[]
    }
    handleOk=(e)=>{  
        let {formList}=this.props
        formList.value=e[0]
        this.triggerChange(...e);
    }
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
          onChange(changedValue);
        }
      }
    render(){
        const {formList,disabled,optdata}=this.props
        const {title,fieldId,value}=formList
        return (
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
                    onChange={v => this.setState({ value: v })}
                    onOk={e=>this.handleOk(e)}
                >
                    <List.Item arrow="horizontal">{title}</List.Item>
                </Picker>
            </div>
        )
    }
}
    