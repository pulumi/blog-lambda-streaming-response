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

const bufferedFunc = new aws.lambda.Function("buffered-func", {
  code: new pulumi.asset.FileArchive("../../lambda"),
  role: role.arn,
  handler: "index.handler",
  runtime: "nodejs14.x",
  timeout: 30,
});

new aws.lambda.Permission("buffered-permission", {
  action: "lambda:InvokeFunctionUrl",
  "function": bufferedFunc.arn,
  principal: "*",
  functionUrlAuthType: "NONE",
});

const bufferedUrl = new awsNative.lambda.Url("buffered-url", {
  authType: "NONE",
  targetFunctionArn: bufferedFunc.arn,
  invokeMode: "BUFFERED",
});

exports.bufferedUrl = bufferedUrl.functionUrl;