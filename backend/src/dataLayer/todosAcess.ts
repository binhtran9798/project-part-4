import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

const attachment = new AttachmentUtils()
const logger = createLogger('todos');

export class TodosAccess {
    constructor(
        private readonly docClient =  attachment.getDocumentClient(),
        private readonly table = process.env.TODOS_TABLE,
    ) {}

    async createItem(todoItem: TodoItem): Promise<TodoItem> {
        const queryParams = {
            TableName: this.table,
            Item: todoItem
        };
        await this.docClient
        .put(queryParams).promise()
        logger.info('createItem successfully');
        return todoItem as TodoItem;
    }

    async deleteItem(todoId: string, userId: string) {
        const queryParams = {
            TableName: this.table,
            Key: {
                todoId,
                userId
            }
        };
        await this.docClient
        .delete(queryParams).promise()
        logger.info('createItem successfully');
    }

    async getItems(userId: string): Promise <TodoItem[]> {
        const queryParams = {
            TableName: this.table,
            IndexName: process.env.TODOS_CREATED_AT_INDEX,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
        const data = await this.docClient
        .query(queryParams).promise()
        logger.info('createItem successfully');
        return data.Items as TodoItem[];
    }

    async updateItem(
        todoId: string,
        userId: string,
        updateTodo: TodoUpdate
    ) {
        const queryParams = {
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
        };
        await this.docClient
        .update(queryParams).promise()
        logger.info('createItem successfully');
    }
}