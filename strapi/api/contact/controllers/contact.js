module.exports = {
  // POST /contact
  index: async ctx => {
    let postedData = ctx.request.body;

    strapi.services.email.send(postedData.email, "contact@maxmastalerz.com", postedData.name, postedData.subject, postedData.number, postedData.text);

    // Send response to the server.
    ctx.send({
      ok: true,
    });
  },
};