module.exports = ({ env }) => {

  const emailSettings = {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY'),
      secret: env('AWS_SES_SECRET'),
      amazon: 'https://email.us-east-2.amazonaws.com',
    },
    settings: {
      defaultFrom: 'contact@maxmastalerz.com',
    },
  };

  if(env('NODE_ENV') === "development") {
    return {
      email: emailSettings
    };
  } else if(env('NODE_ENV') === "production") {
    return {
      email: emailSettings,
      upload: {
        provider: 'aws-s3-cloudfront',
        providerOptions: {
          accessKeyId: env('AWS_S3_KEY'),
          secretAccessKey: env('AWS_S3_SECRET'),
          region: env('AWS_S3_REGION'),
          params: {
            Bucket: env('AWS_S3_BUCKET'),
          },
          cdn: env('AWS_CLOUDFRONT')
        },
      },
    };
  } else { //Nothing else right now...
    return {};
  }
}