module.exports = ({ env }) => {
	let baseUrl = "maxmastalerz.com";
	if(env('NODE_ENV') === "development") {
		baseUrl = "dev."+baseUrl;
	}

	return ({
		host: env('HOST'),
		port: env.int('PORT'),
		admin: {
			auth: {
				secret: env('ADMIN_JWT_SECRET'),
			},
		},
		url: `http://${baseUrl}/api`,
	});
};
