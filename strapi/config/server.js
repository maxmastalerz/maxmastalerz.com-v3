module.exports = ({ env }) => {
	return ({
		host: env('HOST'),
		port: env.int('PORT'),
		admin: {
			auth: {
				secret: env('ADMIN_JWT_SECRET'),
			},
		},
		url: env('PROTOCOL')+'api.'+env('BASE_URL'),
	});
};
