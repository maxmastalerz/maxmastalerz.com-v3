module.exports = ({ env }) => {
	const protocol = env('NODE_ENV') === 'production' ? 'https://' : 'http://';
	const isDev = env.bool('IS_DEV', false);
	const devPrefix = isDev ? 'dev.' : '';

	console.log(`Launching strapi with NODE_ENV: ${env('NODE_ENV')} and IS_DEV: ${env.bool('IS_DEV')}`);
	console.log(`Strapi URL: ${protocol}api.${devPrefix}maxmastalerz.com`);

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
