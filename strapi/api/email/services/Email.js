const emailTemplate = {
  subject: '<%= sender.subject %>',
  text: `This email was sent via the maxmastalerz.com contact form\n
          From: <%= sender.name %>\n
          Email: <%= sender.email %>.\n
          Phone: <%= sender.number %>\n
          Message: <%= sender.text %>\n`,
  html: `<u>This email was sent via the maxmastalerz.com contact form</u><br>
          <b>From:</b> <%= sender.name %><br>
          <b>Email:</b> <%= sender.email %><br>
          <b>Phone:</b> <%= sender.number %><br>
          <b>Message:</b><br><%= sender.text %><br>`,
};

module.exports = {
  send: (replyTo, to, name, subject, number, text) => {
    // Return a promise of the function that sends the email.
    return strapi.plugins.email.services.email.sendTemplatedEmail(
      {
        from: "contact@maxmastalerz.com",
        replyTo: replyTo,
        to: to,
      },
      emailTemplate,
      {
        sender: {name, email: replyTo, subject, number, text},
      }
    );
  },
};
