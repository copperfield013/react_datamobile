import React ,{ Component } from 'react'
import { Picker,List,Badge } from 'antd-mobile';

export default class RelationPicker extends Component{

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
        const {formList,dot,optdata}=this.props
        const {title,id,value}=formList      
        return (
            <div>
                <Picker
                    extra="请选择(可选)"                                       
                    data={optdata}
                    title={`请选择${title}`}
                    cols={1}
                    cascade={false}
                    key={id}
                    value={value?[value]:''}
                    onChange={v => this.setState({ value: v })}
                    onOk={e=>this.handleOk(e)}
                >
                    <List.Item arrow="horizontal"><Badge dot={dot}>{title}</Badge></List.Item>
                </Picker>
            </div>
        )
    }
}
    