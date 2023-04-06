# blog-lambda-streaming-response

This repository contains sample code to demonstrate AWS Lambda Response Streaming. The Pulumi stack in this repository creates two otherwise identical AWS Lambda functions with the same code and configuration, except that one is configured to send buffered responses and the other sends a streaming response. The function code emits one sentence of [The Gettysburg Address](https://en.wikipedia.org/wiki/Gettysburg_Address) per second.

To demonstrate the function _without_ streaming:

```bash
cd pulumi/buffered
pulumi up
curl -N $(pulumi stack output bufferedUrl)
```

To demonstrate the function _with_ streaming:

```bash
cd pulumi/streaming
pulumi up
curl -N $(pulumi stack output streamingUrl)
```
