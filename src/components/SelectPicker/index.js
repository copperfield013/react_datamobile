import React ,{ Component } from 'react'
import { Picker,List } from 'antd-mobile';

export default class SelectPicker extends Component{

    state={
        fieldValue:this.props.fieldValue?[this.props.fieldValue]:""
    }
    render(){
        const {data,title,fieldId}=this.props
        const {fieldValue}=this.state
        return (
            <div>
                <Picker
                    extra="请选择(可选)"                                       
                    data={data}
                    title={`请选择${title}`}
                    cols={1}
                    cascade={false}
                    key={fieldId}
                    value={fieldValue}
                    onChange={v => this.setState({ fieldValue: v })}
                    onOk={e => console.log('ok', e)}
                    onDismiss={e => console.log('dismiss', e)}
                >
                    <List.Item arrow="horizontal">{title}</List.Item>
                </Picker>
            </div>
        )
    }
}
    