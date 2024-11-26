'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getTodos() {
  try {
    return await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error("Failed to fetch todos:", error)
    throw new Error("Failed to fetch todos. Please try again later.")
  }
}

export async function addTodo(title: string) {
  try {
    await prisma.todo.create({
      data: { title }
    })
  } catch (error) {
    console.error("Failed to add todo:", error)
    throw new Error("Failed to add todo. Please try again later.")
  }
}

export async function updateTodo(id: string, title: string, completed: boolean) {
  try {
    await prisma.todo.update({
      where: { id },
      data: { title, completed }
    })
  } catch (error) {
    console.error("Failed to update todo:", error)
    throw new Error("Failed to update todo. Please try again later.")
  }
}

export async function deleteTodo(id: string) {
  try {
    await prisma.todo.delete({
      where: { id }
    })
  } catch (error) {
    console.error("Failed to delete todo:", error)
    throw new Error("Failed to delete todo. Please try again later.")
  }
}

