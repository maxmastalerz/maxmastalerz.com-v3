#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MaxMastalerzComStack } from '../lib/stacks/maxmastalerzcom/maxmastalerzcom-stack';
import prodProps from './env-config/prod';

const app = new cdk.App();
new MaxMastalerzComStack(app, 'MaxMastalerzComStack', {
  env: { account: '244252657288', region: 'us-east-2' },
  description: 'Cloudformation Stack for maxmastalerz.com',
  ...prodProps
});