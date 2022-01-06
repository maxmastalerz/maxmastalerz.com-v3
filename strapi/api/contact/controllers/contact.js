const { verify } = require('hcaptcha');

const processRequest = async (postedData, ctx) => {
  try {
    const secret = process.env.HCAPTCHA_SECRET_KEY;
    const token = postedData.hCaptchaValue;

    let { success } = await verify(secret, token);

    if(success) {
      strapi.services.email.send(postedData.email, "contact@maxmastalerz.com", postedData.name, postedData.subject, postedData.number, postedData.text);

      ctx.send({data: {
        message: "Your message has been sent."
      }});
    } else {
      ctx.send({error: {
        code: 1,
        message: "Your message couldn't be sent due to a captcha verification issue."
      }});
    }
  } catch(err) {
    ctx.send({error: {
      code: 2,
      message: err
    }});
  }
}

const isValidRequest = (postedData) => {
  let isValid = true;

  if(!(postedData.name !== undefined && postedData.name.length > 0)) {
    isValid = false;
  }

  if(!(postedData.email !== undefined && /^\S+@\S+$/i.test(postedData.email))) {
    isValid = false;
  }

  if(!(postedData.subject !== undefined && postedData.subject.length > 0)) {
    isValid = false;
  }

  if(!(postedData.text !== undefined && postedData.text.length > 0)) {
    isValid = false;
  }

  if(!(postedData.hCaptchaValue !== undefined && postedData.hCaptchaValue.length > 0)) {
    isValid = false;
  }

  return isValid;
};

module.exports = {
  // POST /contact
  index: async ctx => {
    const postedData = ctx.request.body;
    let valid = isValidRequest(postedData);

    if(valid) { //If valid request that meets requirements.
      await processRequest(postedData, ctx);
    } else {
      ctx.send({error: {
        code: 3,
        message: "Invalid request."
      }});
    }

  },
};