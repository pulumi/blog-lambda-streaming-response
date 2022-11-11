import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsNative from "@pulumi/aws-native";


const role = new aws.iam.Role("role", {
  assumeRolePolicy: JSON.stringify({
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com",
      },
      "Action": "sts:AssumeRole",
    }],
  }),
});

new aws.iam.RolePolicyAttachment("role-policy-attachment", {
  role: role.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const streamingFunc = new aws.lambda.Function("streaming-func", {
  code: new pulumi.asset.FileArchive("../../lambda"),
  role: role.arn,
  handler: "index.handler",
  runtime: "nodejs14.x",
  timeout: 30,
});

new aws.lambda.Permission("streaming-permission", {
  action: "lambda:InvokeFunctionUrl",
  "function": streamingFunc.arn,
  principal: "*",
  functionUrlAuthType: "NONE",
});

const streamingUrl = new awsNative.lambda.Url("streaming-url", {
  authType: "NONE",
  targetFunctionArn: streamingFunc.arn,
  invokeMode: "RESPONSE_STREAM",
});

exports.streamingUrl = streamingUrl.functionUrl;
