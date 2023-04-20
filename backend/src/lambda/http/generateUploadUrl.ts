import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { responseUtils } from '../../helpers/responseUtils';
import { generateUploadUrl } from '../../dataLayer/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const uploadUrl = await generateUploadUrl(todoId)
    return new responseUtils().successWithBody(201, 'uploadUrl', uploadUrl);
  }
