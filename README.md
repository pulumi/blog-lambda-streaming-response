# blog-lambda-streaming-response

This repository contains sample code to demonstrate AWS Lambda Response Streaming. The Pulumi stack in this repository creates two otherwise identical AWS Lambda functions with the same code and configuration, except that one is configured to send buffered responses and the other sends a streaming response. The function code emits one sentence of [The Gettysburg Address](https://en.wikipedia.org/wiki/Gettysburg_Address) per second.

To deploy the stack:

```bash
pulumi up
```

To view the streamed response:

```bash
curl -N $(pulumi stack output streamingUrl)
```

To view the buffered response:

```bash
curl -N $(pulumi stack output bufferedUrl)
```
