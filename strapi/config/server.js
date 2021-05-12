module.exports = ({ env }) => {
	let baseUrl = "maxmastalerz.com";
	let baseUrlWithProto = "";

	if(env('NODE_ENV') === "development") {
		baseUrl = "dev."+baseUrl;
		baseUrlWithProto = "http://"+baseUrl;
	} else {
		baseUrlWithProto = "https://"+baseUrl;
	}

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
