import { TodosAccess } from '../dataLayer/todosAcess';
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

//write get todo function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Calling getTodos function')
    return todosAcess.getAllTodos(userId)
}

//write create todo function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Create todo function called')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }
    return await todosAcess.createTodoItem(newItem)
}