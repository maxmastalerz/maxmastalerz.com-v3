module.exports = ({ env }) => {
	const base_url_lookup = env('ENV')+'_BASE_URL';
	const base_url = env(base_url_lookup);

	return ({
		host: env('HOST'),
		port: env.int('PORT'),
		admin: {
			auth: {
				secret: env('ADMIN_JWT_SECRET'),
			},
		},
		url: `http://${base_url}/api`,
	});
};
