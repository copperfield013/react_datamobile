import React ,{ Component } from 'react'
import { List,Toast,Popover } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import superagent from 'superagent'
import Units from './../../units'
import './index.css'
const Itempop = Popover.Item;


const sessionStorage=window.sessionStorage
class Create extends Component{

    state={
        itemList:[],
        optArr:[],
    }
    componentWillMount(){
        const {menuId}=this.props.match.params
        this.setState({
            menuId,
        })
        this.loadRequest(menuId)
    }
    loadRequest=(menuId)=>{
        Super.super({
            url:`/api/entity/curd/dtmpl/${menuId}`,         
        }).then((res)=>{
            if(res && res.entity){
                this.setState({
                    itemList:res.entity.fieldGroups
                })
                const selectId=[] //提取select的id
                res.entity.fieldGroups.map((item)=>{
                    if(item.fields){
                        item.fields.map((it)=>{
                            if(it.type==="select" || it.type==="label"){
                                selectId.push(it.fieldId)
                            }
                            return false
                        })
                    }
                    return false
                })      
                if(selectId.length>0){
                    this.requestSelect(selectId)
                }  
                // console.log(res.entity.fieldGroups)       
                // console.log(selectId)
            }
        })
    }
    requestSelect=(selectId)=>{
        const optArr=[]
        const formData = new FormData();
        const tokenName=Units.getLocalStorge("tokenName")
        selectId.map((item)=>{
            formData.append('fieldIds',item);
            return false
        })
        superagent
            .post(`/api/field/options`)
            .set({"datamobile-token":tokenName})
            .send(formData)
            .end((req,res)=>{
                if(res.status===200){                                          
                    optArr.push(res.body.optionsMap)
                    this.setState({
                        optArr
                    })
                }else if(res.status===403){
                    Toast.info("请求权限不足,可能是token已经超时")
                    window.location.href="/#/login";
                }else if(res.status===404||res.status===504){
                    Toast.info("服务器未开···")
                }else if(res.status===500){
                    Toast.info("后台处理错误。")
                }
            })
    }
    handlePop=(value)=>{
        if(value==="home"){
            this.props.history.push(`/home`)
        }else if(value==="loginOut"){
            this.props.history.push(`/login`)
        }else if(value==="user"){
            this.props.history.push(`/user`)
        }else if(value==="save"){
            this.handleSubmit()
        }
    }
    handleSubmit=()=>{
        this.props.form.validateFields({ force: true }, (err, values) => { //提交再次验证
            // for(let k in values){
            //     if(typeof values[k]==="object" && Array.isArray(values[k])===false){
            //         console.log(values[k])
            //         values[k]=Units.dateToString(values[k])
            //     }
            // } 
            console.log(values)  
            //this.props.handleSearch(values)         
        })
    }
    menuOpen=(menuId)=>{
        this.props.history.push(`/${menuId}`)
    }
    addList=(index)=>{
        let {itemList,optArr}=this.state
        const descs=[]
        if(itemList[index].composite.addType===5){ //添加关系选择
            const relation={}
            const composite=itemList[index].composite
            const relaOptions=[]
            composite.relationSubdomain.map((item)=>{
                const list={}
                list["title"]=item
                list["value"]=item
                list["label"]=item
                relaOptions.push(list)
            })
            relation["id"]=composite.id
            relation["type"]="relation"
            relation["title"]="关系"
            relation["fieldName"]="关系"
            relation["relationSubdomain"]=relaOptions
            descs.push(relation)
            optArr[0][`field_${composite.id}`]=relaOptions
        }
        descs.push(...itemList[index].descs)
        const list={}
        list["id"]=itemList[index].id
        list["title"]=itemList[index].title
        list["composite"]=itemList[index].composite
        list["descs"]=itemList[index].descs
        if(itemList[index].stmplId){
            list["stmplId"]=itemList[index].stmplId
        }  
        if(itemList[index].fields){//有fields,说明添加了1次以上
            const field=itemList[index].fields
            field.push(...descs)
            list["fields"]=field
        }else{
            list["fields"]=descs
        }  
        itemList.splice(index,1,list)
        console.log(itemList)
        this.setState({
            itemList,
            optArr
        })
    }
    render(){      
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const { getFieldProps } = this.props.form;
        const {itemList,optArr}=this.state
        console.log(itemList)
        const createPop=[      
            (<Itempop key="5" value="home" icon={<span className="iconfont">&#xe62f;</span>}>首页</Itempop>),
            (<Itempop key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Itempop>),
            (<Itempop key="3" value="save" icon={<span className="iconfont">&#xe61a;</span>}>保存</Itempop>),
            (<Itempop key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Itempop>),
        ]
        return (
            <div className="create">
                <Nav 
                    title={`创建`}
                    data={data}
                    handleSelected={this.handlePop}
                    menuOpen={this.menuOpen}
                    pops={createPop}
                    />
                <div>
                    {
                        itemList.map((item,index)=>{
                            return <List 
                                        renderHeader={() => 
                                            <div className="listHeader">
                                                <span>{item.title}</span>
                                                {item.composite?
                                                    <div className="detailButtons">
                                                        <span className="iconfont" onClick={()=>this.addList(index)}>&#xe63d;</span>
                                                        <span className="iconfont">&#xe6f4;</span>
                                                    </div>:""
                                                }
                                            </div>} 
                                            key={`${item.id}[${index}]`}>
                                        {
                                            item.fields?item.fields.map((it,index)=>{
                                                return <FormCard 
                                                            key={`${it.fieldId}[${index}]`} 
                                                            formList={it}
                                                            getFieldProps={getFieldProps}
                                                            optionKey={it.optionKey}
                                                            optArr={optArr}
                                                            form={this.props.form}
                                                        />
                                            })
                                            :""
                                        }
                                    </List>
                        })
                    }
                </div>
            </div>
        )
    }
}
export default createForm()(Create);