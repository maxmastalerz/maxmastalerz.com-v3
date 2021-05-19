'use strict';

const fs = require('fs');
const axios = require('axios');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

async function get_stream_from_url(url) {
	return new Promise((resolve) => {
		axios({
			method: 'get',
			url: url,
			responseType: 'stream'
		})
		.then(function (response) {
			resolve(response.data);
		});
	});
}

module.exports = {
	async findOne(ctx) {
		const { name } = ctx.params;

		const entity = await strapi.services.download.findOne({ name });

		if(entity) {
			if(entity.download.url[0] === '/') { //local file.
				ctx.body = fs.createReadStream(`${__dirname}/../../../public${entity.download.url}`);
				ctx.set('Content-disposition', `attachment; filename=${entity.name}`);
				ctx.set('Content-type', entity.download.mime);
			} else { //file stored in s3
				ctx.body = await get_stream_from_url(entity.download.url);
				ctx.set('Content-disposition', `attachment; filename=${entity.name}`);
				ctx.set('Content-type', entity.download.mime);
			}
		}
	},
};
