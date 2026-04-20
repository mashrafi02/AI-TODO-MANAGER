import React, { useRef, useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import PreviousComponents from './collectionComponents/PreviousComponents';
import { useDispatch } from 'react-redux';
import { clearCurrentTodo, setcurrentTodo } from '../featurs/todoSlice';


const CollectionBar = ({ onNavigate }) => {
  const [showNewInput , setShowNewInput] = useState(false);
  const titleRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <div className='h-full flex flex-col bg-white border-r border-slate-200/80'>
        {/* Header */}
        <div className='px-5 pt-6 pb-4'>
            <h2 className='text-lg font-bold text-slate-800 mb-5 pl-1 tracking-tight'>Projects</h2>
            <button className='w-full flex justify-center items-center gap-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-300 to-orange-400 text-white cursor-pointer hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]'
            onClick={() => {
              setShowNewInput(true);
              dispatch(clearCurrentTodo());
            }}
            disabled={showNewInput}>
                <FaPlus size={14} />
                <span className='font-semibold text-sm'>New Project</span>
            </button>
        </div>

        {/* Collection list */}
        <div className='flex-1 overflow-y-auto sidebar-scroll px-4 pb-4'>
            <PreviousComponents showNewInput={showNewInput} setShowNewInput={setShowNewInput} titleRef={titleRef} onNavigate={onNavigate}/>
        </div>
    </div>
  )
}

export default CollectionBar;