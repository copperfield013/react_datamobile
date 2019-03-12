import React ,{ Component } from 'react'
import { Picker,List } from 'antd-mobile';

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

export default class SelectPicker extends Component{

    state={
        optdata:[]
    }
    onVisibleChange=()=>{
        let optdata=[]       
        const {formList,optArr}=this.props
        const {fieldId}=formList
        if(optArr && optArr.length>0){
            optArr.map((item)=>{
                for(let k in item){
                    if(k.indexOf(fieldId)>-1){
                        item[k].map((it)=>{
                            it["label"]=it.title
                            return false
                        })
                        optdata.push(item[k])
                    }
                }
                return false
            })
        }
        this.setState({
            optdata
        })
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
        const {formList}=this.props
        const {title,fieldId,value}=formList
        const {optdata}=this.state   
        return (
            <div>
                <Picker
                    extra="请选择(可选)"                                       
                    data={optdata&&optdata.length>0?optdata:seasons}
                    title={`请选择${title}`}
                    cols={1}
                    cascade={false}
                    key={fieldId}
                    value={value?[value]:''}
                    onVisibleChange={this.onVisibleChange}
                    onChange={v => this.setState({ value: v })}
                    onOk={e=>this.handleOk(e)}
                >
                    <List.Item arrow="horizontal">{title}</List.Item>
                </Picker>
            </div>
        )
    }
}
    