import React, { useEffect, useRef, useState } from 'react';
import { useDeleteTodoMutation, useUpdateTodoMutation, useToggleDoneMutation } from '../../services/todoApi';
import toast from 'react-hot-toast';
import clickOutside from '../../utils/clickOutside';


const Todo = ({todo, refetch}) => {

    const [deleteTodo] = useDeleteTodoMutation();
    const [isEdit, setIsEdit] = useState(false);
    const [updateInput, setUpdateInput] = useState(todo.title)
    const updateRef = useRef(null);
    const editRef = useRef(null);
    const [updateTodo] = useUpdateTodoMutation();
    const [toggleDone] = useToggleDoneMutation();
    const [isDone, setIsDone] = useState(todo.done || false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
    if (isEdit && editRef.current) {
        editRef.current.focus();
    }
    }, [isEdit])

    async function handleDelete () {
        try {
            setDeleting(true);
            await deleteTodo({todoId: todo._id});
            refetch()
        } catch (error) {
            setDeleting(false);
            console.log(error)
        }
    }

    async function handleUpdate(){
        if (updateInput.trim() === ""){            
            toast.error('You can not update empty field');
            setUpdateInput(todo.title);
            setIsEdit(false)
            return
        }

        try {
            const response = await updateTodo({params:{todoId:todo._id}, body:{title:updateInput}});
            setIsEdit(false);
            refetch();
        } catch (error) {
            console.log(error)
        }
    }

    clickOutside(updateRef, () => {
        setIsEdit(false);
    })

    async function handleToggleDone() {
        try {
            setIsDone(!isDone);
            await toggleDone({ todoId: todo._id });
        } catch (error) {
            setIsDone(isDone);
            console.log(error);
        }
    }

  return (
    <li className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-all duration-200 ${deleting ? 'opacity-50 scale-[0.98] pointer-events-none' : ''} ${isDone ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-slate-50 border-slate-200/60 hover:border-slate-300'}`} ref={updateRef}>
        <div className="flex items-start sm:items-center gap-x-3 min-w-0 flex-1">
            <input
                type="checkbox"
                checked={isDone}
                onChange={handleToggleDone}
                className="w-[18px] h-[18px] accent-emerald-500 cursor-pointer mt-1 sm:mt-0 shrink-0"
            />
            {
                isEdit ? <form onSubmit={(e) => e.preventDefault()} className='flex-1 min-w-0'>
                            <input type="text" value={updateInput} onChange={(e) => setUpdateInput(e.target.value)} ref={editRef}
                                className='w-full px-3 py-1.5 text-sm font-medium bg-white focus:outline-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition'/>
                        </form> : 
                (
                    <div className="min-w-0">
                        <h2 className={`font-semibold text-sm sm:text-base leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>{todo.title}</h2>
                        <p className={`text-xs mt-0.5 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>{todo.category}</p>
                    </div>
                )
            }
        </div>
        <div className='flex items-center gap-x-2 sm:gap-x-3 shrink-0 pl-8 sm:pl-0'>
            <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                todo.priority === "High"
                    ? "bg-rose-100 text-rose-600"
                    : todo.priority === "Medium"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
            >
                {todo.priority}
            </span>
            <div className='flex items-center gap-x-1.5'>
                <button className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 text-white text-xs ${isDone ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'} ${isEdit? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-violet-500 hover:bg-violet-600'}`}>
                    {isEdit? <span onClick={handleUpdate}>Save</span> 
                            : 
                            <span onClick={() => {
                                if (!isDone) setIsEdit(true);
                            }}>Edit</span>}
                </button>
                <button className={`px-3 py-1.5 rounded-lg font-semibold bg-rose-500 transition-all duration-150 text-white text-xs ${isDone ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-rose-600 active:scale-95'}`}
                onClick={() => { if (!isDone) handleDelete(); }}>
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    </li>
  )
}

export default Todo