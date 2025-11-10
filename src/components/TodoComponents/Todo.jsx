import React, { useEffect, useRef, useState } from 'react';
import { useDeleteTodoMutation, useUpdateTodoMutation } from '../../services/todoApi';
import toast from 'react-hot-toast';
import clickOutside from '../../utils/clickOutside';


const Todo = ({todo, refetch}) => {

    const [deleteTodo] = useDeleteTodoMutation();
    const [isEdit, setIsEdit] = useState(false);
    const [updateInput, setUpdateInput] = useState(todo.title)
    const updateRef = useRef(null);
    const editRef = useRef(null);
    const [updateTodo] = useUpdateTodoMutation();

    useEffect(() => {
    if (isEdit && editRef.current) {
        editRef.current.focus();
    }
    }, [isEdit])

    async function handleDelete () {
        try {
            await deleteTodo({todoId: todo._id});
            refetch()
        } catch (error) {
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

  return (
    <li className="p-3 bg-purple-100 rounded-md shadow flex justify-between items-center" ref={updateRef}>
        {
            isEdit ? <form onSubmit={(e) => e.preventDefault()} className='w-[400px]'>
                        <input type="text" value={updateInput} onChange={(e) => setUpdateInput(e.target.value)} ref={editRef}
                            className='w-full px-4 py-2 text-sm font-semibold bg-white focus:outline border-2 border-gray-100 rounded-full'/>
                    </form> : 
            (
                <div>
                    <h2 className="font-semibold max-w-[540px]">{todo.title}</h2>
                    <p className="text-sm text-gray-500">{todo.category}</p>
                </div>
            )
        }
        <div className='flex items-center gap-x-10'>
            <span
                className={`px-2 py-1 rounded text-sm ${
                todo.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : todo.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
            >
                {todo.priority}
            </span>
            <div className='flex items-center gap-x-2'>
                <span className={`px-4 py-2 rounded-md shadow-mf font-bold transition-all ease-linear duration-100 text-white text-sm cursor-pointer ${isEdit? 'bg-green-500 hover:bg-green-800' : ' bg-blue-400 hover:bg-blue-800'}`}>
                    {isEdit? <span onClick={handleUpdate}>
                                Update
                            </span> 
                            : 
                            <span onClick={() => {
                                setIsEdit(true);
                            }}>
                                Edit
                            </span>}
                </span>
                <span className='px-4 py-2 rounded-md shadow-mf font-bold bg-red-400 hover:bg-red-800 transition-all ease-linear duration-100 text-white text-sm cursor-pointer'
                onClick={handleDelete}>
                    Delete
                </span>
            </div>
        </div>
    </li>
  )
}

export default Todo