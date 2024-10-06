#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdalithAndSinglePurposeLambdaStack } from '../lib/lambdalith-and-single-purpose-lambda-stack';

const app = new cdk.App();
new LambdalithAndSinglePurposeLambdaStack(app, 'LambdalithAndSinglePurposeLambdaStack');
