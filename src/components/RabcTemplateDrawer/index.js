import { Drawer,Toast } from 'antd-mobile';
import React, { Component } from 'react';
import Details from './../../pages/details'
import Super from './../../super'

export default class RabcTemplateDrawer extends Component {

    state={
        showRabcTempDrawer:this.props.showRabcTempDrawer,
    }
    loadEntites = (codes,fieldGroupId) => {
        const {menuId,dtmplGroup}=this.props
        const arr=[]
        let addModal
        dtmplGroup.forEach((item)=>{
            if(item.id===fieldGroupId){
                addModal=item
                item.fields.forEach((it)=>{
                    arr.push(it.id)
                })
            }
        })
        let dfieldIds=arr.join(",")
		Super.super({
			url: `api2/entity/curd/load_entities/${menuId}/${fieldGroupId}`,
			data: {
				codes,
				dfieldIds,
			}
		}).then((res) => {
			if(res.status === "suc") {
				this.props.loadTemplate(res.entities,addModal)
				this.props.shutRabcTem()
			} else {
				Toast.error(res.status)
			}
		})
	}
    render(){
        const {menuId,groupId,showRabcTempDrawer,tempCode}=this.props
        let sidebar =groupId?<Details 
                                menuId = {menuId}
                                code={tempCode}
                                fieldGroupId={groupId}   
                                shutRabcTem={this.props.shutRabcTem}
                                loadEntites={this.loadEntites}
                            />:1
        return <Drawer
                    className={showRabcTempDrawer?"openDrawer":"shutDraw"}
                    style={{ minHeight: document.documentElement.clientHeight-45 }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={sidebar}
                    open={showRabcTempDrawer}
                    position="right"
                    touch={false}
                    enableDragHandle
                    onOpenChange={this.onOpenChange}
                >
                &nbsp;    
                </Drawer>
    }
}