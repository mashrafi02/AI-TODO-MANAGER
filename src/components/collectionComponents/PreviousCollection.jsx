import React, { useRef, useState } from 'react'
import clickOutside from '../../utils/clickOutside';
import { HiDotsHorizontal } from "react-icons/hi";
import { useDeleteCollectionMutation } from '../../services/collectionApi';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentTodo } from '../../featurs/todoSlice';

const PreviousCollection = ({element, refetch, setShowNewInput, onNavigate}) => {

      const [showDelete, setShowDelete] = useState(false);
      const [deleting, setDeleting] = useState(false);
      const deleteRef = useRef(null);
      const [deleteCollection] = useDeleteCollectionMutation();
      const {currentTodo} = useSelector(state => state.todo);
      const dispatch = useDispatch();
    
      clickOutside(deleteRef, () => setShowDelete(false));


      const handleDelete = async () => {
        try {
            setDeleting(true);
            setShowDelete(false);
            await deleteCollection({collectionId: element._id}).unwrap();
            refetch();
            dispatch(setcurrentTodo(null))
        } catch (error) {
            setDeleting(false);
            console.log(error)
        }
      }

      const currentCollection = currentTodo?._id === element._id ? true : false;

  return (
    <div className={`flex justify-between items-center px-3 py-2.5 mb-1.5 rounded-xl cursor-pointer transition-all duration-200
        ${deleting ? 'opacity-50 scale-[0.97] pointer-events-none' : ''}
        ${currentCollection? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        onClick={() => {
        dispatch(setcurrentTodo(element));
        setShowNewInput(false);
        onNavigate?.();
        }}>
        <p className='font-medium text-sm px-1 py-0.5 w-[120px] truncate'>{element.title}</p>
        <div className='flex items-center gap-x-1.5'>
            <span className={`text-[10px] ${currentCollection ? 'text-white/70' : 'text-slate-400'}`}>{element.createdAt.split('T')[0]}</span>
            <span className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100 cursor-pointer relative
            ${currentCollection ? 'hover:bg-white/20' : 'hover:bg-slate-300'}`}
            onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true)
            }} 
            ref={deleteRef}>
                <HiDotsHorizontal size={14}/>
                {
                    showDelete && (
                        <div className='w-36 rounded-xl shadow-lg px-3 py-2 text-center bg-white border border-slate-200 absolute top-8 right-0 z-10'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete()
                                }}>
                            <p className='text-xs font-semibold text-slate-600 hover:text-rose-500 transition-all duration-100'>Delete Project</p>
                        </div>
                    )
                }
            </span>
        </div>
    </div>
  )
}

export default PreviousCollection