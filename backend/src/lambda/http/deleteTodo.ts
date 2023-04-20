import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { responseUtils } from '../../helpers/responseUtils';
import { deleteTodo } from '../../dataLayer/todos'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event);
    await deleteTodo(
      todoId,
      userId
    )
    return new responseUtils().successWithoutBody(204);
  }
