module.exports = ({ env }) => {
	let baseUrlWithProto = env('PROTOCOL')+env('BASE_URL');

	return ({
		host: env('HOST'),
		port: env.int('PORT'),
		admin: {
			auth: {
				secret: env('ADMIN_JWT_SECRET'),
			},
		},
		url: `${baseUrlWithProto}/api`,
	});
};
