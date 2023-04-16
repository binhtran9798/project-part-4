import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly table = process.env.TODOS_TABLE,
        private readonly index = process.env.TODOS_CREATED_AT_INDEX
    ) {}

    async createItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('createItem');
        logger.info('new item: ', todoItem);
        await this.docClient
        .put({
            TableName: this.table,
            Item: todoItem
        }).promise()
        return todoItem as TodoItem;
    }

    async deleteItem(todoId: string, userId: string) {
        logger.info('deleteItem');
        logger.info('item to delete: ', todoId);
        logger.info('from user: ', userId);
        await this.docClient
        .delete({
            TableName: this.table,
            Key: {
                todoId,
                userId
            }
        }).promise()
    }

    async getItems(userId: string): Promise <TodoItem[]> {
        logger.info('getItems');
        logger.info('get Items for user: ', userId);
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

    async updateItem(
        todoId: string,
        userId: string,
        updateTodo: TodoUpdate
    ) {
        logger.info('updateItem');
        logger.info('Update Item for user: ', userId);
        logger.info('Item to update: ', todoId);
        logger.info('updateTodo: ', updateTodo);
        await this.docClient
        .update({
            TableName: this.table,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': updateTodo.name,
                ':dueDate': updateTodo.dueDate,
                ':done': updateTodo.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
        }).promise()
    }
}