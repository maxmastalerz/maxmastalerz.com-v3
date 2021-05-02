'use strict';

const fs = require('fs');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	async findOne(ctx) {
		const { name } = ctx.params;

		const entity = await strapi.services.download.findOne({ name });

		if(entity) {
			//const downloadLink = `/api${entity.download.url}`;
			//ctx.redirect(downloadLink);
			const downloadLink = `/api${entity.download.url}`;
			ctx.body = fs.createReadStream(`${__dirname}/../../../public${entity.download.url}`);
			ctx.set('Content-disposition', `attachment; filename=${entity.name}`);
			ctx.set('Content-type', entity.download.mime);
		}
	},
};
