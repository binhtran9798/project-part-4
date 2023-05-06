import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const attachment = new AttachmentUtils();
const todosAccess = new TodosAccess();

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    const todoId = uuid.v4();
    return await todosAccess.createItem({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: attachment.getAttachmentUrl(todoId),
        ...newTodo,
    });
};

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getItems(userId);
}

export async function generateUploadUrl(
    todoId: string,
): Promise<string> {
    return attachment.getFileUploadedUrl(todoId)
};

export async function deleteImage(
    todoId: string,
) {
    return attachment.deleteImage(todoId)
};

export async function deleteTodo(
    todoId: string,
    userId: string
) {
    return todosAccess.deleteItem(todoId, userId);
};

export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
) {
    return todosAccess.updateItem(todoId, userId, todoUpdate);
};
