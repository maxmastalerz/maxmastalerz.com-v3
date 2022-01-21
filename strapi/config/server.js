/*| USE_HTTPS | NODE_ENV=production | WHAT STRAPI URL WILL BE USED |
  |-----------+---------------------+------------------------------|
  |           |                     | http://dev.maxmastalerz.com  |
  |           |          y          | http://maxmastalerz.com      |
  |     y     |          y          | https://maxmastalerz.com     |*/

module.exports = ({ env }) => {
	const devPrefix = env('NODE_ENV') === 'production' ? '' : 'dev.';
	const useHttps = env.bool('USE_HTTPS', false);
	const protocol = useHttps ? 'https://' : 'http://';

	console.log(`Launching strapi with NODE_ENV: ${env('NODE_ENV')} and USE_HTTPS: ${env.bool('USE_HTTPS', false)}`);
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