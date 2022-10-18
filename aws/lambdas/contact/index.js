const { verify } = require('hcaptcha');
const aws = require("aws-sdk");
let ses = new aws.SES({ region: "us-east-2" });

const processRequest = async (postedData) => {

	try {
		const secret = process.env.HCAPTCHA_SECRET_KEY;
		const token = postedData.hCaptchaValue;

		let { success } = await verify(secret, token);

		if (success) {
			const params = {
				"Source": "contact@maxmastalerz.com",
				"Template": "ContactTemplate",
				"Destination": {
					"ToAddresses": [ postedData.email ]
				},
				"TemplateData": "{ \"sender_subject\":postedData.subject,\"sender_name\":postedData.name, \"sender_email\":postedData.email ,\"sender_number\":postedData.number, \"sender_message\": postedData.text }"
			}
			
			const response = ses.sendTemplatedEmail(params, (err, data) =>  {
				if (err) {
					console.log(err, err.stack); // an error occurred
					return {
						statusCode: 400,
						body: JSON.stringify({
							data: {
								message: err
							}
						}),
					};
				} else{
					console.log(data);           // successful response
					return {
						statusCode: 200,
						body: JSON.stringify({
							data: {
								message: "Your message has been sent."
							}
						}),
					};
				}     
			});

			
		} else {
			return {
				statusCode: 400,
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
			body: JSON.stringify({
				error: {
					code: 2,
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

exports.handler = async (event) => {
	const postedData = JSON.parse(event.body);
	let valid = isValidRequest(postedData);

	if (valid) { //If valid request that meets requirements.
		return await processRequest(postedData);
	} else {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: {
					code: 3,
					message: "Invalid request."
				}
			}),
		};
	}

};