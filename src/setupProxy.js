const proxy = require('http-proxy-middleware');
const DATACENTER_URL = 'http://139.196.123.44/datacenter_api';
//const DATACENTER_URL = 'http://114.55.104.82:5050/xfjd';
//const DATACENTER_URL = 'http://192.168.2.105:7080/datacenter';
module.exports = function(app) {
	app.use(proxy('/api', {
		target: `${DATACENTER_URL}/api`,
		changeOrigin: true,
		pathRewrite: {
			'^/api': function(path, req) {
				return path.replace(/^\/api/, '');
			}
		},
	}));
	app.use(proxy('/file-server', {
		target: `${DATACENTER_URL}`,
		changeOrigin: true,
		pathRewrite: {
			'^/file-server': function(path, req) {
				return path.replace(/^\/file-server/, '');
			}
		}
	}))
}