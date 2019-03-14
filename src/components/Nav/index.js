import React ,{ Component } from 'react'
import { NavBar, Icon, Popover,Menu,ActivityIndicator } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import './index.css'

class Nav extends Component{
    state={
        visible:false,
        selected: '',
        initData: '',
        show: false,
    }
    onSelect = (opt) => {
        //console.log(opt.props.value);
        this.props.handleSelected(opt.props.value)
        this.setState({
          visible: false,
          selected: opt.props.value,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };
    onChange = (value) => {
        const menuId=value[value.length-1]
        this.props.history.push(`/${menuId}`)
        this.props.menuOpen(menuId)
        document.body.style.overflow='auto';
        this.setState({
            show: false,
        });
    }
    handleClick = (e) => {
        const {data}=this.props;
        e.preventDefault(); // Fix event propagation on Android
        this.setState({
            show: true,
        });
        document.body.style.overflow='hidden';
        // mock for async data loading
        if (!this.state.initData) {
            setTimeout(() => {
            this.setState({
                initData: data,
            });
            }, 500);
        }
    }
    onMaskClick = () => {
        this.setState({
            show: false,
        });
        document.body.style.overflow='auto';
    }
    render(){
        const {title,pops}=this.props;
        const {initData,show,visible}=this.state
        const menu = (
            <Menu
              className="foo-menu"
              data={initData}
              onChange={this.onChange}
              height={document.documentElement.clientHeight * 0.6}
            />
          );
        const loadingEl = (
        <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
        </div>
        );
        return (
            <div className={show ? 'menu-active' : ''}>
                <div className="my-nav">
                <NavBar
                    mode="dark"
                    leftContent={title==="易+数据融合工具"?"":"菜单"}
                    onLeftClick={this.handleClick}
                    rightContent={
                        <Popover mask
                            overlayClassName="fortest"
                            overlayStyle={{ color: 'currentColor' }}
                            visible={visible}
                            overlay={pops}
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
                </div>
                {show ? initData ? menu : loadingEl : null}
                {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
            </div>
        )
    }
}
export default withRouter(Nav)