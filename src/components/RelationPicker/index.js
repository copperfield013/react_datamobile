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

export default class RelationPicker extends Component{

    state={
      optdata:[]
    }
    onVisibleChange=()=>{
      let optdata=[]       
      const {formList,optArr}=this.props
      const {id}=formList
      if(optArr && optArr.length>0){
          optArr.map((item)=>{
              for(let k in item){
                  if(k.indexOf(id)>-1){
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
      const v=e[0]
      this.triggerChange({v});
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
          onChange(Object.assign({}, this.state, changedValue));
        }
      }
    render(){
        const {formList}=this.props
        const {title,id,value}=formList
        const {optdata}=this.state       
        return (
            <div>
                <Picker
                    extra="请选择(可选)"                                       
                    data={optdata&&optdata.length>0?optdata:seasons}
                    title={`请选择${title}`}
                    cols={1}
                    cascade={false}
                    key={id}
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
    