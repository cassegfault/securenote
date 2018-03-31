module.exports = {
	devServer: {
		host: '0.0.0.0',
		disableHostCheck:true,
		port:8081
	},
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			config.output.publicPath = 'https://securecdn.cc/';
		} else {
			config.output.publicPath = '/';
		}
	}
}