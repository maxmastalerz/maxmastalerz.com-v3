const { verify } = require('hcaptcha');
const aws = require("aws-sdk");
let ses = new aws.SES({ region: "us-east-2" });

function escapeHtml(unsafe)
{
	return unsafe
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/g, "&#039;");
}

const sendTemplatedEmail = (postedData) => {
	return new Promise((resolve, reject) => {
		
		let templateData = {
			sender_subject: escapeHtml(postedData.subject),
			sender_name: escapeHtml(postedData.name),
			sender_email: escapeHtml(postedData.email),
			sender_number: escapeHtml(postedData.number),
			sender_message: escapeHtml(postedData.text)
		}
		templateData.sender_message = templateData.sender_message.replace(new RegExp('\r?\n','g'), '<br/>');
	
		const params = {
			"Source": "contact@maxmastalerz.com",
			"Template": "ContactTemplate",
			"Destination": {
				"ToAddresses": [ "contact@maxmastalerz.com" ]
			},
			"ReplyToAddresses": [ postedData.email ],
			"TemplateData": JSON.stringify(templateData)
		}
	
		ses.sendTemplatedEmail(params, (err, data) =>  {
			if (err) {
				reject({
					statusCode: 400,
					headers: {
						"Access-Control-Allow-Origin": "https://maxmastalerz.com"
					},
					body: JSON.stringify({
						data: {
							message: err
						}
					}),
				});
			} else {
				resolve({
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "https://maxmastalerz.com"
					},
					body: JSON.stringify({
						data: {
							message: "Your message has been sent."
						}
					}),
				});
			}
		});

	});
}

const processRequest = async (postedData) => {
	try {
		const secret = process.env.HCAPTCHA_SECRET_KEY;
		const token = postedData.hCaptchaValue;
		
		let { success } = await verify(secret, token);

		if (success) {
			return await sendTemplatedEmail(postedData);
		} else {
			return {
				statusCode: 400,
				headers: {
					"Access-Control-Allow-Origin": "https://maxmastalerz.com"
				},
				body: JSON.stringify({
					error: {
						code: 1,
						message: "Your message couldn't be sent due to a captcha verification issue."
					}
				})
			};
		}
	} catch (err) {
		return {
			statusCode: 400,
			headers: {
				"Access-Control-Allow-Origin": "https://maxmastalerz.com"
			},
			body: JSON.stringify({
				error: {
					code:2,
					message: err
				}
			}),
		};
	}
}

const isValidRequest = (postedData) => {
	let isValid = true;

	if (!(postedData.name !== undefined && postedData.name.length > 0)) {
		isValid = false;
	}

	if (!(postedData.email !== undefined && /^\S+@\S+$/i.test(postedData.email))) {
		isValid = false;
	}

	if (!(postedData.subject !== undefined && postedData.subject.length > 0)) {
		isValid = false;
	}

	if (!(postedData.text !== undefined && postedData.text.length > 0)) {
		isValid = false;
	}

	if (!(postedData.hCaptchaValue !== undefined && postedData.hCaptchaValue.length > 0)) {
		isValid = false;
	}

	return isValid;
};

//Contact Lambda Function Start
exports.handler = async (event) => {
	const postedData = JSON.parse(event.body);
	let valid = isValidRequest(postedData);

	if (valid) { //If valid request that meets requirements.
		return await processRequest(postedData);
	} else {
		return {
			statusCode: 400,
			headers: {
				"Access-Control-Allow-Origin": "https://maxmastalerz.com"
			},
			body: JSON.stringify({
				error: {
					code: 3,
					message: "Invalid request."
				}
			}),
		};
	}

};