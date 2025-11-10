import React, { useRef, useState } from 'react'
import clickOutside from '../../utils/clickOutside';
import { HiDotsHorizontal } from "react-icons/hi";
import { useDeleteCollectionMutation } from '../../services/collectionApi';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentTodo } from '../../featurs/todoSlice';

const PreviousCollection = ({element, refetch, setShowNewInput}) => {

      const [showDelete, setShowDelete] = useState(false);
      const deleteRef = useRef(null);
      const [deleteCollection] = useDeleteCollectionMutation();
      const {currentTodo} = useSelector(state => state.todo);
      const dispatch = useDispatch();
    
      clickOutside(deleteRef, () => setShowDelete(false));


      const handleDelete = async () => {
        try {
            await deleteCollection({collectionId: element._id}).unwrap();
            refetch();
            dispatch(setcurrentTodo(null))
        } catch (error) {
            console.log(error)
        }
      }

      const currentCollection = currentTodo?._id === element._id ? true : false;

  return (
    <div className={`flex justify-between items-center px-4 mb-2 rounded-full cursor-pointer font-bold 
        ${currentCollection? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}
        onClick={() => {
        dispatch(setcurrentTodo(element));
        setShowNewInput(false)
        }}>
        <p className='font-medium px-2 py-2 w-[130px] truncate'>{element.title}</p>
        <div className='flex items-center gap-x-2'>
            <span className='text-xs'>{element.createdAt.split('T')[0]}</span>
            <span className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all ease-linear duration-100 cursor-pointer relative' 
            onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true)
            }} 
            ref={deleteRef}>
                <HiDotsHorizontal/>
                {
                    showDelete && (
                        <div className='w-40 rounded-md shadow-md px-4 py-2 text-center bg-white absolute top-0 left-0 z-10'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete()
                                }}>
                            <p className='text-sm font-semibold hover:text-red-400 transition-all ease-linear duration-100'>Delete Collection</p>
                        </div>
                    )
                }
            </span>
        </div>
    </div>
  )
}

export default PreviousCollection