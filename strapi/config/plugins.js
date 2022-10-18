module.exports = ({ env }) => {

  if(env('NODE_ENV') === "development") {
    return {};
  } else if(env('NODE_ENV') === "production") {
    return {
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