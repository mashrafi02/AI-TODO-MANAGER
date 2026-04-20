import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (build) => ({
    getTodos : build.query({
        query : (params) => ({
            url: '/todo/get-todo',
            method: 'GET',
            params
        })
    }),
    createTodo : build.mutation({
        query : (body) => ({
            url: '/todo/create-todo',
            method: 'POST',
            body
        })
    }),
    deleteTodo : build.mutation({
        query : (params) => ({
            url: '/todo/delete-todo',
            method: 'DELETE',
            params
        })
    }),
    updateTodo : build.mutation({
        query : ({params, body}) => ({
            url: '/todo/update-todo',
            method: 'PUT',
            params,
            body
        })
    }),
    toggleDone : build.mutation({
        query : (params) => ({
            url: '/todo/toggle-done',
            method: 'PATCH',
            params
        })
    }),
  }),
})

export const { useCreateTodoMutation, useGetTodosQuery, useDeleteTodoMutation, useUpdateTodoMutation, useToggleDoneMutation } = todoApi