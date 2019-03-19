import React ,{ Component } from 'react'
import { List,Toast,Popover,ActivityIndicator,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import Nav from './../../components/Nav'
import Super from './../../super'
import FormCard from './../../components/FormCard'
import superagent from 'superagent'
import Units from './../../units'
import TemplateDrawer from './../../components/TemplateDrawer'
import './index.css'
const Itempop = Popover.Item;
const alert = Modal.alert;

const sessionStorage=window.sessionStorage
class Details extends Component{

    state={
        itemList:[],
        optArr:[],
        animating:false,
        herderName:"",
    }
    componentWillMount(){
        const {menuId,code}=this.props.match.params
        this.setState({
            menuId,
            code,
        })
        this.loadRequest(menuId,code)
    }
    loadRequest=(menuId,code)=>{
        this.setState({ animating:true});
        const URL=code?`/api/entity/curd/detail/${menuId}/${code}`:`/api/entity/curd/dtmpl/${menuId}`
        Super.super({
            url:URL,         
        }).then((res)=>{
            if(res && res.entity){
                let itemList=res.entity.fieldGroups
                this.setState({
                    herderName:res.entity.title,
                    animating:false,
                })
                const selectId=[]
                res.entity.fieldGroups.map((item)=>{
                    if(item.fields){
                        item.fields.map((it)=>{ //基础信息里面的选择项
                            if(it.type==="select" || it.type==="label"){
                                selectId.push(it.fieldId)
                            }
                            return false
                        })
                    }else if(item.array){
                        item.array.map((it)=>{
                            it.fields.map((i)=>{//其他列表里面的选择项
                                if(i.type==="select" || i.type==="label"){
                                    selectId.push(i.fieldId)
                                }
                                return false
                            })
                            return false
                        })
                    }
                    return false
                })      
                if(selectId.length>0){
                    this.requestSelect(selectId,itemList,res.premises)
                }else{
                    this.reloadItemList(itemList,res.premises)
                }
            }
        })
    }
    reloadItemList=(itemList,premises,optArr)=>{
        if(premises && premises.length>0){ //判断有无不可修改字段
            const result=[]
            let re=[]
            premises.map((item)=>{
                let list={}
                let li={}
                let fields=[]
                list["id"]=item.id
                list["title"]="不可修改字段"
                li["title"]=item["fieldTitle"]
                li["type"]="text"                    
                li["value"]=item["fieldValue"]         
                li["available"]=false
                li["fieldName"]=item["fieldTitle"]
                fields.push(li)
                list["fields"]=fields
                result.push(list)
                re=fields
                return false
            })
            itemList.map((item)=>{
                if(item.fields){
                    item.fields.map((it)=>{
                        re.map((i)=>{
                            if(it.fieldName===i.fieldName){
                                it.value=i.value
                                it.available=false
                            }
                            return false
                        })                                
                        return false
                    })
                }                       
                return false
            })
            itemList.unshift(...result)
        }
        const totalNameArr=[]
        itemList.map((item)=>{
            if(!item.fields){
                let re=[]
                if(item.array && item.array.length>0){
                    item.array.map((it,index)=>{ 
                        item["i"]=index //加入计数array条数
                        const totname=item.composite.name
                        //删除按钮                                              
                        const deletebtn={}
                        deletebtn["type"]="deletebtn" 
                        deletebtn["deleteCode"]=`${totname}[${index}]`
                        deletebtn["fieldName"]=`${totname}[${index}].deleteCode`
                        re.push(deletebtn) 
                        //关系选项
                        if(item.composite.addType===5){
                            const relation={}
                            const relaOptions=[]
                            item.composite.relationSubdomain.map((item)=>{
                                const list={}
                                list["title"]=item
                                list["value"]=item
                                list["label"]=item
                                relaOptions.push(list)
                                return false
                            })
                            relation["fieldId"]=item.composite.id
                            relation["type"]="relation"
                            relation["value"]=it.relation
                            relation["title"]="关系"
                            relation["validators"]="required"
                            relation["fieldName"]=`${totname}[${index}].关系`
                            relation["relationSubdomain"]=relaOptions
                            optArr[0][`field_${item.composite.id}`]=relaOptions
                            re.push(relation)
                        }  
                        //唯一编码
                        const onlycode={}
                        onlycode["type"]="onlycode"
                        onlycode["fieldName"]=`${totname}[${index}].code`
                        onlycode["value"]=it.code
                        re.push(onlycode) 
                        //列表数据                             
                        it.fields.map((e)=>{
                            const totname=e.fieldName.split(".")[0]
                            const lasname=e.fieldName.split(".")[1]
                            e.fieldName=`${totname}[${index}].${lasname}`
                            return false
                        })
                        re.push(...it.fields)  
                        if(item.composite.addType){
                            totalNameArr.push(item.composite.name)
                        }
                        return false
                    })
                }
                item["fields"]=re
            }
            return false
        })
        this.setState({
            itemList,
            optArr,
            totalNameArr
        })
    }
    addList=(index,data)=>{
        let {itemList,optArr}=this.state
        const needList=itemList[index]
        const i=needList.i>=0?(needList.i+1):0
        const descs=[]
        const totalNm=needList.composite.name
        //删除按钮                                              
        const deletebtn={}   
        deletebtn["type"]="deletebtn" 
        deletebtn["deleteCode"]=`${totalNm}[${index-1}]`
        deletebtn["fieldName"]=`${totalNm}[${index-1}].deleteCode`
        descs.push(deletebtn)
        if(needList.composite.addType===5){ //添加关系选择
            const relation={}
            const composite=needList.composite
            const relaOptions=[]
            composite.relationSubdomain.map((item)=>{
                const list={}
                list["title"]=item
                list["value"]=item
                list["label"]=item
                relaOptions.push(list)
                return false
            })
            relation["fieldId"]=composite.id
            relation["type"]="relation"
            relation["title"]="关系"
            relation["validators"]="required"
            relation["fieldName"]=`${totalNm}.关系`
            relation["relationSubdomain"]=relaOptions
            descs.push(relation)
            optArr[0][`field_${composite.id}`]=relaOptions
        }
        const onlycode={}
        onlycode["type"]="onlycode"
        onlycode["fieldName"]=`${totalNm}.code`
        if(data){
            onlycode["value"]=data["唯一编码"]
        }
        descs.push(onlycode)

        descs.push(...needList.descs)
        const list={}
        list["i"]=i
        list["id"]=needList.id
        list["title"]=needList.title
        list["composite"]=needList.composite
        list["descs"]=needList.descs
        if(needList.stmplId){
            list["stmplId"]=needList.stmplId
        }  
        const arr=[]
        descs.map((item)=>{
            const lasname=item.fieldName.split(".")[1]
            const list={}
            for(let k in item){
                if(k==="fieldName"){
                    list[k]=`${totalNm}[${i}].${lasname}`
                }else{
                    list[k]=item[k]
                }
                if(data){ //从模板中赋值
                    for(let e in data){
                        const itemN=item["fieldName"].split(".")[1]
                        const dataN=e.split(".")[1]
                        if(itemN===dataN){
                            list["value"]=data[e]
                        }
                    }
                }
            }
            arr.push(list)
            return false
        })
        if(needList.fields){//有fields,说明添加了1次以上
            const field=needList.fields           
            field.push(...arr)
            list["fields"]=field
        }else{
            list["fields"]=arr
        }  
        itemList.splice(index,1,list)
        this.setState({
            itemList,
            optArr
        })
    }
    requestSelect=(selectId,itemList,premises)=>{
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
                    this.reloadItemList(itemList,premises,optArr)
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
        const {code,totalNameArr}=this.state //详情codes和整个记录的code
        let isOK=true 
        this.props.form.validateFields({ force: true }, (err, values) => { //提交再次验证
            for(let k in values){
                //name去除图片
                if(values[k] && typeof values[k]==="object" && !Array.isArray(values[k]) && !values[k].name){
                    values[k]=Units.dateToString(values[k])
                }else if(values[k] && typeof values[k]==="object" && Array.isArray(values[k])){
                    const totalName=k
                    values[`${totalName}.$$flag$$`]=true
                    values[k].map((item,index)=>{
                        for(let e in item){
                            if(e==="关系"){
                                e="$$label$$"
                                values[`${totalName}[${index}].${e}`]=item["关系"]
                            }else if(e.indexOf("code")>-1){
                                if(item[e]){
                                    values[`${totalName}[${index}].唯一编码`]=item[e]
                                }else{
                                    delete item[e]
                                }
                            }else if(item[e]===undefined){
                                delete item[e] //删除未更改的图片数据
                            }else{
                                values[`${totalName}[${index}].${e}`]=item[e]
                            }
                        }
                        return false
                    })
                    delete values[k] //删除原始的对象数据
                }
            } 
            totalNameArr.map((item)=>{
                values[`${item}.$$flag$$`]=true
                return false
            })
            //console.log(values)  
            if(!err && isOK){
                this.setState({ animating:true});
                const tokenName=Units.getLocalStorge("tokenName")
                const formData = new FormData();
                const { menuId,}=this.state
                formData.append('唯一编码',code);
                for(let k in values){
                    formData.append(k, values[k]?values[k]:"");
                }
                superagent
                    .post(`/api/entity/curd/update/${menuId}`)
                    .set({"datamobile-token":tokenName})
                    .send(formData)
                    .end((req,res)=>{
                        this.setState({ animating:false});
                        if(res.status===200){                   
                            if(res.body.status==="suc"){
                                Toast.info("保存成功！")
                                this.props.history.push(`/${menuId}`)
                            }else{
                                Toast.error(res.body.status)
                            }
                        }else if(res.status===403){
                            Toast.info("请求权限不足,可能是token已经超时")
                            window.location.href="/#/login";
                        }else if(res.status===404||res.status===504){
                            Toast.info("服务器未开···")
                        }else if(res.status===500){
                            Toast.info("后台处理错误。")
                        }
                    })
            }else{
                Toast.fail("必填选项未填！！")
            }      
        })
    }
    onRef=(ref)=>{
		this.SelectTemplate=ref
    }
    loadTemplate=(res,stmplId,tempcodes)=>{
        const {itemList}=this.state
        if(tempcodes){
            itemList.map((item,index)=>{
                if(item.stmplId && item.stmplId===stmplId){
                    const codeArr=tempcodes.split(",")
                    codeArr.map((it)=>{
                        this.addList(index,res.entities[it])
                        return false
                    })
                }
                return false
            })
        }
    }
    deleteList=(deleteCode)=>{
        let {itemList}=this.state
        itemList.map((item)=>{
            if(item.composite){
                item.fields=item.fields.filter((it)=>it.fieldName.indexOf(deleteCode)===-1)
            }
            return false
        })
        this.setState({
            itemList
        })
    }
    showAlert = (deleteCode,e) => {
        e.stopPropagation()
        const alertInstance = alert('删除操作', '确认删除这条记录吗???', [
          { text: '取消'},
          { text: '确认', onPress: () => this.deleteList(deleteCode) },
        ]);
        setTimeout(() => {
          alertInstance.close();
        }, 10000);
      };
    render(){      
        const data= JSON.parse(sessionStorage.getItem("menuList"))
        const { getFieldProps } = this.props.form;
        const {itemList,optArr,animating,herderName,menuId}=this.state
        const detailPop=[      
            (<Itempop key="5" value="home" icon={<span className="iconfont">&#xe62f;</span>}>首页</Itempop>),
            (<Itempop key="1" value="user" icon={<span className="iconfont">&#xe74c;</span>}>用户</Itempop>),
            (<Itempop key="3" value="save" icon={<span className="iconfont">&#xe61a;</span>}>保存</Itempop>),
            (<Itempop key="2" value="loginOut" icon={<span className="iconfont">&#xe739;</span>}>退出</Itempop>),
        ]       
        return (
            <div className="details">
                <Nav 
                    title={herderName?`详情-${herderName}`:""}
                    data={data}
                    handleSelected={this.handlePop}
                    menuOpen={()=>this.props.history.push(`/${menuId}`)}
                    pops={detailPop}
                    />
                <div>
                    {
                        itemList.map((item,i)=>{
                            return  <List 
                                        renderHeader={() => 
                                            <div className="listHeader">
                                                <span>{item.title}</span>
                                                {item.composite?
                                                    <div className="detailButtons">
                                                        <span className="iconfont" onClick={()=>this.addList(i)}>&#xe63d;</span>
                                                        {
                                                            item.stmplId?<span 
                                                                            className="iconfont"
                                                                            onClick={()=>this.SelectTemplate.onOpenChange(item)}
                                                                            >&#xe6f4;</span>:""
                                                        }
                                                        
                                                    </div>:""
                                                }
                                            </div>} 
                                            key={`${item.id}[${i}]`}>
                                            {
                                                item.fields?item.fields.map((it,index)=>{
                                                    return <FormCard 
                                                                key={`${it.fieldId}[${index}]`} 
                                                                formList={it}
                                                                getFieldProps={getFieldProps}
                                                                optionKey={it.optionKey}
                                                                optArr={optArr}
                                                                deleteList={(e)=>this.showAlert(it.deleteCode,e)}
                                                            />
                                                })
                                                :""
                                            }
                                    </List>
                        })
                    }
                </div>
                <TemplateDrawer 
                    onRef={this.onRef}
                    menuId={menuId}
                    loadTemplate={this.loadTemplate}
                />
                <ActivityIndicator
                    toast
                    text="加载中..."
                    animating={animating}
                />
            </div>
        )
    }
}
export default createForm()(Details);