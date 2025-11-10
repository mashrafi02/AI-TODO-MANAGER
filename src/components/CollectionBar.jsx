import React, { useRef, useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import PreviousComponents from './collectionComponents/PreviousComponents';
import { useDispatch } from 'react-redux';
import { clearCurrentTodo, setcurrentTodo } from '../featurs/todoSlice';


const CollectionBar = () => {
  const [showNewInput , setShowNewInput] = useState(false);
  const titleRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <div className='px-2 py-4 bg-white sticky top-4 left-0 h-[calc(100vh-60px)]'>
        <button className='w-[230px] flex justify-center items-center gap-x-2 px-2 py-4 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all ease-linear duration-150 mb-8 mx-auto'
        onClick={() => {
          setShowNewInput(true);
          dispatch(clearCurrentTodo());
        }}
        disabled={showNewInput}>
            <span className='font-semibold text-base cursor-pointer'>Create New Project</span>
            <FaPlus />
        </button>
        <div>
            <PreviousComponents showNewInput={showNewInput} setShowNewInput={setShowNewInput} titleRef={titleRef}/>
        </div>
    </div>
  )
}

export default CollectionBar;