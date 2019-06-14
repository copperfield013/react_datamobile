import superagent from 'superagent'
import { Toast } from 'antd-mobile';
import Units from './../units'

const api=Units.api()
export default class Superagent {
	static super(options,type) {
		const tokenName = Units.getLocalStorge("tokenName")
		let ty="form"
        if(type==="formdata"){
            ty=null
        }else if(type==="json"){
            ty="application/json"
        }
		return new Promise((resolve, reject) => {
			superagent
				.post(api+options.url)
				.type(ty)
				.set("datacenter-token", tokenName)
				.query(options.query || '')
				.send(options.data || '')
				.end((req, res) => {
					//console.log(res.body)
					if(res.status === 200) {
						resolve(res.body)
					} else if(res.status === 403) {
						Toast.info("请求权限不足,可能是token已经超时")
						window.location.href = "/#/login";
					} else if(res.status === 404 || res.status === 504) {
						Toast.info("服务器未开···")
					} else if(res.status === 500) {
						Toast.info("后台处理错误。")
						window.location.href = "/#/login";
					} else {
						reject(res.body)
					}
				})
		})
	}
}