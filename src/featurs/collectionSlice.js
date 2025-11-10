import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  collections: null
}

export const collectionSlice = createSlice({
  name: 'todoCollection',
  initialState,
  reducers: {
    setTodoCollection: (state, action) => {
        state.collections = action.payload
    },
    cleaTodoCollection : (state) => {
        state.collections = null
    }
  },
})


export const { setTodoCollection, cleaTodoCollection } = collectionSlice.actions

export default collectionSlice.reducer