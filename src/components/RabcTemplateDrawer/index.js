import { Drawer, } from 'antd-mobile';
import React, { Component } from 'react';
import Details from './../../pages/details'

export default class RabcTemplateDrawer extends Component {

    state={
        showRabcTempDrawer:this.props.showRabcTempDrawer,
    }
    
    render(){
        const {menuId,code,groupId,showRabcTempDrawer}=this.props
        let sidebar =groupId?<Details 
                                menuId = {menuId}
                                code={code}
                                fieldGroupId={groupId}   
                                shutRabcTem={this.props.shutRabcTem}
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