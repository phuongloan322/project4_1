import { TodosAccess } from '../dataLayer/todosAcess';
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// import { TodoUpdate } from '../models/TodoUpdate';

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
    // const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: '',
        ...newTodo
    }
    return await todosAcess.createTodoItem(newItem)
}

//Update todo logic function
export async function updateTodo(
    userId: string,
    todoId: string,
    todoUpdate: UpdateTodoRequest
    ): Promise<UpdateTodoRequest> {
    logger.info('Calling update todo function')
    return todosAcess.updateTodoItem(userId, todoId, todoUpdate)           
    }

//Delete todo logic function
export async function deleteTodo(
    todoId: string,
    userId: string
    ): Promise<string> {
    logger.info('Delete todo function called')
    return todosAcess.deleteTodoItem(todoId, userId)
}

//Create attachment function logic
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Create attachment function called by user', userId, todoId)
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    await todosAcess.updateAttachmentUrl(todoId, userId, s3AttachmentUrl)
    return attachmentUtils.getUploadUrl(todoId)    
}