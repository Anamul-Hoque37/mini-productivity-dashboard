import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import auth from '../../firebase.config';
import MotivationalQuote from '../Components/MotivationalQuote';
import Goals from '../Components/Goals';

const initialTasks = {
    'To-Do': [],
    'In Progress': [],
    'Done': [],
};

const TaskManagement = () => {
    const user = auth.currentUser;
    const email = user.email;
    console.log(email);
    const axiosSecure = useAxiosSecure();
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState({ title: '', description: '', category: 'To-Do' });
    const [editingTask, setEditingTask] = useState(null);

    const { data: fetchedTasks = initialTasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks/${email}`);
            console.log('API Response:', res.data); // Debugging

            // Ensure the response has the expected structure
            if (!res.data || typeof res.data !== 'object') {
                throw new Error('Invalid response format');
            }

            return {
                'To-Do': res.data['To-Do']?.map(task => ({ ...task, id: task._id })) || [],
                'In Progress': res.data['In Progress']?.map(task => ({ ...task, id: task._id })) || [],
                'Done': res.data['Done']?.map(task => ({ ...task, id: task._id })) || [],
            };
        },
        staleTime: 0, // Ensure fresh data is fetched every time
    });

    // Update the tasks state when fetchedTasks changes
    useEffect(() => {
        if (fetchedTasks) {
            setTasks(fetchedTasks);
        }
    }, [fetchedTasks]);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // If the task is dropped in the same category and position, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Get the moved task
        const sourceTasks = Array.from(tasks[source.droppableId]);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        // If the task is moved to a different category
        if (source.droppableId !== destination.droppableId) {
            // Update the task's category in the database
            await axiosSecure.patch(`/tasks/${movedTask.id}`, {
                category: destination.droppableId,
            });

            // Add the task to the destination category
            const destinationTasks = Array.from(tasks[destination.droppableId]);
            destinationTasks.splice(destination.index, 0, movedTask);

            // Update the local state
            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destinationTasks,
            }));
        } else {
            // If the task is reordered within the same category
            sourceTasks.splice(destination.index, 0, movedTask);

            // Update the local state
            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: sourceTasks,
            }));
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title.trim()) return;

        const task = {
            title: newTask.title,
            description: newTask.description,
            category: newTask.category,
            uid: user.uid,
            userEmail: email,
        };

        const addTask = await axiosSecure.post('/tasks', task);
        if (addTask.data.insertedId) {
            setTasks((prevTasks) => ({
                ...prevTasks,
                [newTask.category]: [...prevTasks[newTask.category], { ...task, id: addTask.data.insertedId }],
            }));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task added successfully!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to add task.",
                showConfirmButton: false,
                timer: 1500
            });
        }

        setNewTask({ title: '', description: '', category: 'To-Do' });
    };

    const handleEditTask = (category, id) => {
        const taskToEdit = tasks[category].find((task) => task.id === id);
        setEditingTask({ ...taskToEdit, category });
    };

    const handleSaveEdit = async () => {
        if (!editingTask.title.trim()) return;

        const updateTask = await axiosSecure.patch(`/tasks/${editingTask.id}`, {
            title: editingTask.title,
            description: editingTask.description,
            category: editingTask.category,
        });

        if (updateTask.data.modifiedCount > 0) {
            const updatedTasks = tasks[editingTask.category].map((task) =>
                task.id === editingTask.id ? editingTask : task
            );

            setTasks((prevTasks) => ({
                ...prevTasks,
                [editingTask.category]: updatedTasks,
            }));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task updated successfully!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to update task.",
                showConfirmButton: false,
                timer: 1500
            });
        }

        setEditingTask(null);
    };

    const handleDeleteTask = async (category, id) => {
        const deleteTask = await axiosSecure.delete(`/tasks/${id}`);

        if (deleteTask.data.deletedCount > 0) {
            const filteredTasks = tasks[category].filter((task) => task.id !== id);

            setTasks((prevTasks) => ({
                ...prevTasks,
                [category]: filteredTasks,
            }));

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task deleted successfully!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to delete task.",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching tasks</div>;

    return (
        <div className="p-4 max-w-4xl min-h-screen mx-auto">
            <h2 className="text-2xl font-bold mb-4">Daily Task List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Task Title"
                    maxLength={50}
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="border p-2 mr-2 bg-slate-50 text-slate-950 rounded-md"
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    maxLength={200}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="border p-2 mr-2 bg-slate-50 text-slate-950 rounded-md"
                />
                <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="border p-2 mr-2 bg-slate-50 font-semibold text-teal-500 rounded-md"
                >
                    <option className='font-semibold text-slate-800' value="To-Do">To-Do</option>
                    <option className='font-semibold text-slate-800' value="In Progress">In Progress</option>
                    <option className='font-semibold text-slate-800' value="Done">Done</option>
                </select>
                <button onClick={handleAddTask} className="bg-fuchsia-600 hover:bg-fuchsia-800 text-white p-2 rounded-md px-3 font-semibold">
                    Add Task
                </button>
            </div>
            {editingTask && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Edit Title"
                        maxLength={50}
                        value={editingTask.title}
                        onChange={(e) =>
                            setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        className="border p-2 mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Edit Description"
                        maxLength={200}
                        value={editingTask.description}
                        onChange={(e) =>
                            setEditingTask({ ...editingTask, description: e.target.value })
                        }
                        className="border p-2 mr-2"
                    />
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white p-2">
                        Save
                    </button>
                    <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-500 text-white p-2 ml-2"
                    >
                        Cancel
                    </button>
                </div>
            )}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(tasks).map((category) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-4 rounded"
                                >
                                    <h3 className="font-semibold mb-2 text-slate-800">{category}</h3>
                                    {tasks[category].map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-2 mb-2 rounded shadow hover:bg-fuchsia-50"
                                                >
                                                    <h4 className="font-semibold text-slate-800 text-center pb-2">{task.title}</h4>
                                                    <p className='text-emerald-500 text-sm font-medium border-t-2 pt-2 pb-2'>{task.description}</p>
                                                    <div className="flex justify-between space-x-2">
                                                        <button
                                                            onClick={() => handleEditTask(category, task.id)}
                                                            className="text-yellow-500 rounded-lg px-2 bg-slate-100 hover:bg-fuchsia-600 hover:text-white"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTask(category, task.id)}
                                                            className="text-red-500 rounded-lg px-2 bg-yellow-100 hover:bg-fuchsia-600 hover:text-white"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            
            <div className="bg-gray-100 mt-4 dark:bg-gray-800 p-4">
                {/* Other sections like Navbar, Tasks */}
                <div className="grid md:grid-cols-1 gap-4">
                    {/* Left side: Tasks or other widgets */}
                    {/* Right side: Goals */}
                    <Goals userEmail={user.email} />
                </div>
            </div>
            <div className="bg-gray-100 mt-4 dark:bg-gray-800 p-4">
                {/* Other sections like tasks and goals */}
                <MotivationalQuote />
            </div>
        </div>
    );
};

export default TaskManagement;