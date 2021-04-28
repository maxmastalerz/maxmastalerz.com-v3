module.exports = ({ env }) => ({
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY'),
      secret: env('AWS_SES_SECRET'),
      amazon: 'https://email.us-east-2.amazonaws.com',
    },
    settings: {
      defaultFrom: 'contact@maxmastalerz.com',
    },
  },
});