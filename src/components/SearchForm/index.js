import React, {Component} from 'react'
import { List, Switch, Picker, InputItem, Button } from 'antd-mobile';
import SearchCard from './../../components/FormCard/searchCard'
import { createForm } from 'rc-form';
import Units from './../../units'
const Item = List.Item;

class SearchForm extends Component {

	state = {
		order: true,
	}
	submit = () => {
		this.props.form.validateFields({
			force: true
		}, (err, values) => { //提交再次验证
			for(let k in values) {
				if(typeof values[k] === "object" && Array.isArray(values[k]) === false) {
					console.log(values[k])
					values[k] = Units.dateToString(values[k])
				}
			}
			console.log(values)  
			this.props.handleSearch(values)
		})
	}
	reset = () => {
		this.props.form.resetFields()
	}
	render() {
		const {order} = this.state
		const {searchList,optArr} = this.props
		const {getFieldProps} = this.props.form;
		return(
			<div className="searchForm">
                <List renderHeader={() => '查询条件'}>
                    {
                        searchList.map(item =>
                            <SearchCard 
                                key={item.id} 
                                formList={item}
                                optArr={optArr}
                                getFieldProps={getFieldProps}
                            />
                        )
                    }                                    
                    </List>
                    <List renderHeader={() => `根据字段${order?"顺序":"逆序"}`}>
                        <Item
                            extra={<Switch
                            checked={order}
                            key={order}
                            onChange={() => {
                                this.setState({
                                    order: !order,
                                });
                            }}
                        />}
                        >{order?"顺序":"逆序"}</Item>
                        <Picker data={[[{label:"上海",value:"1",key:"1"},{label:"杭州",value:"2",key:"2"}]]} cols={1}>
                            <Item arrow="horizontal">字段</Item>
                        </Picker>
                    </List>
                    <List renderHeader={() => '页码'}>
                        <InputItem
                            placeholder={`请输入页码`}
                            clear
                            {...getFieldProps("pageNo")}
                            >页码</InputItem>
                        <InputItem
                            placeholder={`请输入每页显示条数`}
                            clear
                            {...getFieldProps("pageSize")}
                            >显示条数</InputItem>
                    </List>
                    <div className="searchButton">
                        <Button type="warning" inline size="small" onClick={this.reset}>重置</Button>
                        <Button type="primary" inline size="small" onClick={this.submit}>查询</Button>
                    </div>
            </div>
		)
	}
}

export default createForm()(SearchForm);