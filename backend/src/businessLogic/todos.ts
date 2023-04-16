import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('todosAccess');
const attachment = new AttachmentUtils();
const todosAccess = new TodosAccess();

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('createTodo');
    const todoId = uuid.v4();
    const newItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: attachment.getAttachmentUrl(todoId),
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
    return attachment.getFileUploadedUrl(todoId)
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
