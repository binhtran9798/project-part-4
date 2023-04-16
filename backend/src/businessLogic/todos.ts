import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('todosAccess');
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess();

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('createTodo');
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId);
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo,
    };

    return await todosAccess.createItem(newItem);
};

export async function deleteTodo(
    todoId: string,
    userId: string
) {
    logger.info('deleteTodo');
    return todosAccess.deleteItem(todoId, userId);
}

export async function generateUploadUrl(
    todoId: string,
): Promise<string> {
    logger.info('generateUploadUrl');
    return attachmentUtils.getUploadUrl(todoId)
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('getTodosForUser');
    return todosAccess.getItems(userId);
}

export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
) {
    logger.info('updateTodo');
    return todosAccess.updateItem(todoId, userId, todoUpdate);
}
