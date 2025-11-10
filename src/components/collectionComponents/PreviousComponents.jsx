import React, { useEffect, useState } from 'react';
import { useGetAllCollectionQuery } from '../../services/collectionApi';
import { useCreateCollectionMutation } from '../../services/collectionApi';
import { useDispatch } from 'react-redux';
import { setcurrentTodo } from '../../featurs/todoSlice';
import PreviousCollection from './PreviousCollection';
import toast from 'react-hot-toast';


const PreviousComponents = ({showNewInput, setShowNewInput, titleRef}) => {

  const {data, isLoading, refetch} = useGetAllCollectionQuery();
  const [collection, setCollection] = useState(data?.collections || [])
  const [createCollection] = useCreateCollectionMutation();
  const dispatch = useDispatch();


  useEffect(() => {
    if (showNewInput && titleRef.current) {
      titleRef.current.focus();
    }
  }, [showNewInput])


  useEffect(() => {
    setCollection(data?.collections)
  }, [data, isLoading])

  const [title, setTitle] = useState('')

  const handleSubmit = async () => {
    if(title.trim() === "") return;

    const titleMatched = collection.some((ele) => ele.title.trim().toLowerCase() === title.trim().toLowerCase());

    if(titleMatched) {
      toast.error('title matched');
      return
    }

    try {
      const response = await createCollection({title}).unwrap();
      dispatch(setcurrentTodo(response?.newCollection));
      setShowNewInput(false);
      setTimeout(() => {
          refetch()
      }, 300);
      setTitle("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {
        showNewInput && (
          <form className='mb-2'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <input type="text" placeholder='Your Project Name' value={title} onChange={(e) => setTitle(e.target.value)}
            className='w-full focus:outline-none px-4 py-2 bg-gray-100 rounded-full border-none text-base'
            ref={titleRef}/>
          </form>
        )
      }
        {
          collection?.map(element => <PreviousCollection key={element._id} element={element} refetch={refetch} setShowNewInput={setShowNewInput}/>)
        }
    </div>
  )
}

export default PreviousComponents