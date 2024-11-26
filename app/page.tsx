'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, X } from 'lucide-react'
// import Image from 'next/image'

interface Todo {
  id: string
  title: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  const saveTodos = (updatedTodos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    setTodos(updatedTodos)
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        completed: false
      }
      saveTodos([...todos, newTodoItem])
      setNewTodo('')
      playSound('create')
    }
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    )
    saveTodos(updatedTodos)
    playSound('edit')
  }

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    saveTodos(updatedTodos)
    playSound('delete')
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.title)
  }

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      updateTodo(editingId, { title: editingText.trim() })
      setEditingId(null)
      setEditingText('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const playSound = (action: 'create' | 'edit' | 'delete') => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(`/sounds/${action}.mp3`)
      audio.play().catch(error => console.error('Error playing sound:', error))
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        {/* <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        /> */}
      </div>
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white/90 p-6 backdrop-blur-sm shadow-2xl">
          <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Todo List</h1>
          <div className="flex mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTodo()
                }
              }}
              placeholder="Add a new todo"
              className="mr-2 flex-grow"
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg shadow-sm backdrop-blur-sm">
                {editingId === todo.id ? (
                  <>
                    <Input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          saveEdit()
                        }
                      }}
                      className="flex-grow mr-2"
                    />
                    <Button onClick={saveEdit} size="sm" className="mr-1">Save</Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline"><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={(checked) => updateTodo(todo.id, { completed: checked as boolean })}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                      {todo.title}
                    </label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => startEditing(todo)}
                      className="mr-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

