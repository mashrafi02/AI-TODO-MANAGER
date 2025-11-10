import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { collectionApi } from '../services/collectionApi'
import todoReducer from '../featurs/todoSlice';
import collectionReducer from "../featurs/collectionSlice"
import { todoApi } from '../services/todoApi';


export const store = configureStore({
  reducer: {
    [collectionApi.reducerPath]: collectionApi.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
    todo: todoReducer,
    collection: collectionReducer
  },
  devTools: import.meta.env.MODE !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
        .concat(collectionApi.middleware)
        .concat(todoApi.middleware),
})

setupListeners(store.dispatch)