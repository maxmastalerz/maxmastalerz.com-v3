module.exports = ({ env }) => {
	const protocol = env('NODE_ENV') === 'production' ? 'https://' : 'http://';
	const isDev = env.bool('IS_DEV', false);
	const devPrefix = isDev ? 'dev.' : '';

	return ({
		host: env('HOST'),
		port: env.int('PORT'),
		admin: {
			auth: {
				secret: env('ADMIN_JWT_SECRET'),
			},
		},
		//Either http://api.dev.maxmastalerz.com , http://api.maxmastalerz.com, or https://api.maxmastalerz.com
		url: `${protocol}api.${devPrefix}maxmastalerz.com`,
	});
};
