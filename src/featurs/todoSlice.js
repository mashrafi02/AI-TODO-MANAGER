import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentTodo: null
}

export const todoSlice = createSlice({
  name: 'currentTodo',
  initialState,
  reducers: {
    setcurrentTodo : (state, action) => {
        state.currentTodo = action.payload
    },
    clearCurrentTodo : (state) => {
        state.currentTodo = null
    }
  },
})


export const { setcurrentTodo, clearCurrentTodo } = todoSlice.actions

export default todoSlice.reducer