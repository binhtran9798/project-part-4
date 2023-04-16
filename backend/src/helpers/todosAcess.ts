import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly table = process.env.TODOS_TABLE,
        private readonly index = process.env.TODOS_CREATED_AT_INDEX
    ) {}

    async getItems(userId: string): Promise <TodoItem[]> {
        logger.info('getItems');
        const data = await this.docClient
        .query({
            TableName: this.table,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return data.Items as TodoItem[];
    }

    async createItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('createItem');
        await this.docClient
        .put({
            TableName: this.table,
            Item: todoItem
        }).promise()
        return todoItem as TodoItem;
    }

    async updateItem(
        todoId: string,
        userId: string,
        todoUpdate: TodoUpdate
    ) {
        logger.info('updateItem');
        await this.docClient
        .update({
            TableName: this.table,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
    }

    async deleteItem(todoId: string, userId: string) {
        logger.info('deleteItem');
        await this.docClient
        .delete({
            TableName: this.table,
            Key: {
                todoId,
                userId
            }
        }).promise()
    }
}