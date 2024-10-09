import {
  aws_apigateway,
  aws_lambda,
  aws_lambda_nodejs,
  aws_logs,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class LambdalithAndSinglePurposeLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const monolithLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'MonolithLambda',
      {
        architecture: aws_lambda.Architecture.ARM_64,
        entry: 'src/lambdalith/entry-point.ts',
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        bundling: {
          forceDockerBundling: false,
        },
      },
    );

    const singlePurposeLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'SinglePurposeLambda',
      {
        architecture: aws_lambda.Architecture.ARM_64,
        entry: 'src/single-purpose-lambda/dog.ts',
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        bundling: {
          forceDockerBundling: false,
        },
      },
    );

    /**
     * REST API を作成
     */
    const logGroup = new aws_logs.LogGroup(
      this,
      'MonolithSinglePurposeTogetherAccessLogs',
    );
    const restApi = new aws_apigateway.RestApi(
      this,
      'MonolithSinglePurposeTogether',
      {
        defaultIntegration: new aws_apigateway.LambdaIntegration(
          monolithLambda,
        ),
        defaultCorsPreflightOptions: {
          allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
          allowMethods: aws_apigateway.Cors.ALL_METHODS,
          allowHeaders: aws_apigateway.Cors.DEFAULT_HEADERS,
        },
        cloudWatchRole: true,
        cloudWatchRoleRemovalPolicy: RemovalPolicy.DESTROY,
        deployOptions: {
          accessLogDestination: new aws_apigateway.LogGroupLogDestination(
            logGroup,
          ),
          accessLogFormat: aws_apigateway.AccessLogFormat.clf(),
        },
      },
    );
    restApi.root.addProxy();
    restApi.root
      .addResource('animals')
      .addResource('dog')
      .addMethod(
        'GET',
        new aws_apigateway.LambdaIntegration(singlePurposeLambda, {
          proxy: true,
        }),
      );
  }
}
