import React ,{ Component } from 'react'
import { NavBar, Icon, Popover } from 'antd-mobile';
const Item = Popover.Item;

export default class Nav extends Component{
    state={
        visible:false,
    }
    render(){
        const {title}=this.props
        return (
            <NavBar
                mode="dark"
                leftContent="Back"
                rightContent={
                    <Popover mask
                        overlayClassName="fortest"
                        overlayStyle={{ color: 'currentColor' }}
                        visible={this.state.visible}
                        overlay={[
                        (<Item key="5" value="special" icon={<Icon type="right" />} style={{ whiteSpace: 'nowrap' }}>用户</Item>),
                        (<Item key="6" value="button ct" icon={<Icon type="right" />}>
                            <span style={{ marginRight: 5 }}>退出</span>
                        </Item>),
                        ]}
                        align={{
                        overflow: { adjustY: 0, adjustX: 0 },
                        offset: [-10, 0],
                        }}
                        onVisibleChange={this.handleVisibleChange}
                        onSelect={this.onSelect}
                    >
                        <div style={{
                            height: '100%',
                            padding: '0 15px',
                            marginRight: '-15px',
                            display: 'flex',
                            alignItems: 'center',
                            }}>
                        <Icon type="ellipsis" />
                        </div>
                    </Popover>
                    }>
                {title}
            </NavBar>
        )
    }
}