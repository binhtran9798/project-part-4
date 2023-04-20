import {  APIGatewayProxyResult } from 'aws-lambda'
export class responseUtils {
    successWithBody(code: number, key: string, value: any): APIGatewayProxyResult {
        return {
            statusCode: code,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                [key]: value,
            }),
        }
    }
    successWithoutBody(code: number): APIGatewayProxyResult {
        return {
            statusCode: code,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: '',
        }
    }
}