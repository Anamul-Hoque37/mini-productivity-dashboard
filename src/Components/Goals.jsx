// src/Components/Goals.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Goals = ({ userEmail }) => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const [goalType, setGoalType] = useState('weekly'); // weekly or monthly

    // Fetch goals
    useEffect(() => {
        if (userEmail) {
            axios.get(`http://localhost:5000/goals/${userEmail}`)
                .then(res => setGoals(res.data))
                .catch(err => console.error(err));
        }
    }, [userEmail]);

    const handleAddGoal = async () => {
        if (!newGoal) return;
        const goal = {
            title: newGoal,
            userEmail,
            type: goalType,
            completed: false,
        };
        const res = await axios.post('http://localhost:5000/goals', goal);
        setGoals([...goals, res.data]);
        setNewGoal('');
    };

    const toggleGoalComplete = async (id, completed) => {
        await axios.patch(`http://localhost:5000/goals/${id}`, { completed: !completed });
        setGoals(goals.map(goal =>
            goal._id === id ? { ...goal, completed: !completed } : goal
        ));
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/goals/${id}`);
        setGoals(goals.filter(goal => goal._id !== id));
    };

    const weeklyGoals = goals.filter(goal => goal.type === 'weekly');
    const monthlyGoals = goals.filter(goal => goal.type === 'monthly');

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Goals</h2>

            {/* Add Goal Form */}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Add a new goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                />
                <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <button
                    onClick={handleAddGoal}
                    className="w-32 bg-fuchsia-600 text-white px-2 py-2 rounded"
                >
                    Add Goal
                </button>
            </div>

            <div className='flex flex-col md:flex-row justify-evenly'>
                {/* Weekly Goals */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">🗓️ Weekly Goals</h3>
                    {weeklyGoals.length === 0 && <p className="text-gray-500">No weekly goals yet.</p>}
                    <ul className="space-y-2">
                        {weeklyGoals.map(goal => (
                            <li
                                key={goal._id}
                                className="flex items-center justify-between border p-2 rounded"
                            >
                                <span
                                    className={`flex-1 cursor-pointer ${goal.completed ? 'line-through text-gray-400' : ''}`}
                                    onClick={() => toggleGoalComplete(goal._id, goal.completed)}
                                >
                                    {goal.title}
                                </span>
                                <button onClick={() => handleDelete(goal._id)} className="text-red-500 font-bold ml-2">✕</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Monthly Goals */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">📅 Monthly Goals</h3>
                    {monthlyGoals.length === 0 && <p className="text-gray-500">No monthly goals yet.</p>}
                    <ul className="space-y-2">
                        {monthlyGoals.map(goal => (
                            <li
                                key={goal._id}
                                className="flex items-center justify-between border p-2 rounded"
                            >
                                <span
                                    className={`flex-1 cursor-pointer ${goal.completed ? 'line-through text-gray-400' : ''}`}
                                    onClick={() => toggleGoalComplete(goal._id, goal.completed)}
                                >
                                    {goal.title}
                                </span>
                                <button onClick={() => handleDelete(goal._id)} className="text-red-500 font-bold ml-2">✕</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Goals;
