import {Toast} from 'antd-mobile'

export default {
    formateDate(time){
        if(!time) return '';
        const date=new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
    },
    uniq(array){
      var temp = [];
      var index = [];
      var l = array.length;
      for(var i = 0; i < l; i++) {
          for(var j = i + 1; j < l; j++){
              if (array[i] === array[j]){
                  i++;
                  j = i;
              }
          }
          temp.push(array[i]);
          index.push(i);
      }
      return temp;
    },
    pagination(data,callback){
        const page={
            onchange:(current)=>{
                callback(current)
            },
            current:data.pageInfo.pageNo,
            pageSize:data.pageInfo.pageSize,
            total:data.pageInfo.count,
            showTotal:()=>{
                return `共${data.pageInfo.count}条`
            },
            showQuickIumper:true
        }
        return page
    },
    downloadFile(url) {   
        try{ 
            let elemIF = document.createElement("iframe");   
            elemIF.src = url;   
            elemIF.style.display = "none";   
            document.body.appendChild(elemIF);   
        }catch(e){ 
            Toast.error(e)
        } 
    },
    setCookie(cname,cvalue,exdays){
        const d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        const expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname){
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++){
            const c = ca[i].trim();
            if (c.indexOf(name)===0) return c.substring(name.length,c.length);
        }
        return "";
    },
    delCookie(cname){ 
        const exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        const cval=this.getCookie(cname); 
        if(cval!=null) 
            document.cookie= cname + "="+cval+";expires="+exp.toGMTString(); 
    },
    //随机数
    RndNum(n){   
        let rnd="";
        for(let i=0;i<n;i++)
            rnd+=Math.floor(Math.random()*10);
        return rnd;
    },
    setLocalStorge(key, value, min) {
        // 设置过期原则
        if (!value) {
          localStorage.removeItem(key)
        } else {
          const Min = min || 30; // 默认保留30分钟
          const exp = new Date();
          localStorage[key] = JSON.stringify({
            value,
            expires: exp.getTime() + Min * 60 * 1000
          })
        }
      },
    getLocalStorge(name) {
        try {
          let o = JSON.parse(localStorage[name])
          if (!o || o.expires < Date.now()) {
            return null
          } else {
            return o.value
          }
        } catch (e) {
            // 兼容其他localstorage
          return localStorage[name]
        } finally {
        }
      },
      queryParams(data, isPrefix = false){
        let prefix = isPrefix ? '?' : ''
        let _result = []
        for (let key in data) {
          let value = data[key]
          // 去掉为空的参数
          if (['', undefined, null].includes(value)) {
            continue
          }
          if (value.constructor === Array) {
            value.forEach(_value =>{
                _result.push(encodeURI(key) + '[]=' + encodeURI(_value))
                })
            } else {
                const str=encodeURI(key).replace("criteria","c")
                _result.push(str + '=' + encodeURI(value))
            }
        }
    
        return _result.length ? prefix + _result.join('&') : ''
      } ,
        urlToObj(str){
            let obj = {};
            const arr1 = str.split("?");
            const arr2 = arr1[1].split("&");
            for(let i=0 ; i < arr2.length; i++){
            const res = arr2[i].split("=");
            const str=res[0].replace("c","criteria")
                obj[str] = res[1];
            }
            return obj;
        },
}