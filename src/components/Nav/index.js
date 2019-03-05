import React ,{ Component } from 'react'
import { NavBar, Icon, Popover,Menu,ActivityIndicator } from 'antd-mobile';
import './index.css'
const Item = Popover.Item;

export default class Nav extends Component{
    state={
        visible:false,
        selected: '',
        initData: '',
        show: false,
    }
    onSelect = (opt) => {
        console.log(opt.props.value);
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
        const {data}=this.props;
        let label = '';
        data.forEach((dataItem) => {
          if (dataItem.value === value[0]) {
            label = dataItem.label;
            if (dataItem.children && value[1]) {
              dataItem.children.forEach((cItem) => {
                if (cItem.value === value[1]) {
                  label += ` ${cItem.label}`;
                }
              });
            }
          }
        });
        console.log(value);
        console.log(label);
    }
    handleClick = (e) => {
        const {data}=this.props;
        console.log(data)
        e.preventDefault(); // Fix event propagation on Android
        this.setState({
            show: !this.state.show,
        });
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
    }
    render(){
        const {title}=this.props;
        const {initData,show,visible}=this.state
        const menu = (
            <Menu
              className="foo-menu"
              data={initData}
              value={['30005', '30026']}
              onChange={this.onChange}
              height={document.documentElement.clientHeight * 0.6}
            />
          );
        const loadingEl = (
        <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
        </div>
        );
        const homePop=[
            (<Item key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Item>),
            (<Item key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
            ]
        const otherPop=[      
            (<Item key="5" value="home" icon={<span className="iconfont">&#xe62f;</span>}>首页</Item>),
            (<Item key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Item>),
            (<Item key="3" value="search" icon={<span className="iconfont">&#xe72f;</span>}>筛选</Item>),
            (<Item key="4" value="create" icon={<span className="iconfont">&#xe60a;</span>}>创建</Item>),
            (<Item key="6" value="export" icon={<span className="iconfont">&#xe616;</span>}>导出</Item>),  
            (<Item key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Item>),
            ]
        return (
            <div className={show ? 'menu-active' : ''}>
                <div>
                <NavBar
                    mode="dark"
                    leftContent={title==="首页"?"":"Menu"}
                    onLeftClick={this.handleClick}
                    rightContent={
                        <Popover mask
                            overlayClassName="fortest"
                            overlayStyle={{ color: 'currentColor' }}
                            visible={visible}
                            overlay={title==="首页"?homePop:otherPop}
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