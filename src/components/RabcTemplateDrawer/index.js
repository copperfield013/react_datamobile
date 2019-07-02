import { Button, Checkbox, Drawer, List, Toast } from 'antd-mobile';
import React, { Component } from 'react';
import Super from './../../super';

export default class RabcTemplateDrawer extends Component {

    render(){
        let sidebar = (<span>dsfcds</span>)
        const {showRabcTempDrawer}=this.props
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