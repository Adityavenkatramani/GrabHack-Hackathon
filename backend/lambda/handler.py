import boto3
import json

def lambda_handler(event, context):
    body = json.loads(event["body"])
    query = body.get("query")

    bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "prompt": f"User query: {query}. Respond with financial recommendations using Grab's fintech stack.",
            "max_tokens": 300
        })
    )

    result = json.loads(response['body'].read())
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"response": result})
    }
