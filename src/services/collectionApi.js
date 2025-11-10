import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const collectionApi = createApi({
  reducerPath: 'collectionApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (build) => ({
    getAllCollection : build.query({
        query : () => ({
            url: '/collection/get-all-collection',
            method: 'GET',
        })
    }),
    createCollection : build.mutation({
        query : (body) => ({
            url: '/collection/create-collection',
            method: 'POST',
            body
        })
    }),
    deleteCollection : build.mutation({
        query : (params) => ({
            url: '/collection/delete-collection',
            method: 'DELETE',
            params
        })
    }),
  }),
})

export const { useGetAllCollectionQuery, useLazyGetAllCollectionQuery, useCreateCollectionMutation, useDeleteCollectionMutation } = collectionApi