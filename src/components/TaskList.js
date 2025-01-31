import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskList.css";

const TaskList = ({ userEmail }) => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`https://mern-todo-back-wdqp.onrender.com`);
            setTasks(response.data.tasks);
            setCompletedTasks(response.data.completedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTask.trim() || !newDeadline) return;

        const today = new Date().toISOString().split("T")[0];
        if (newDeadline < today) {
            alert("Due date cannot be in the past!");
            return;
        }

        try {
            await axios.post("https://mern-todo-back-wdqp.onrender.com", {
                userEmail,
                title: newTask,
                deadline: newDeadline,
            });
            fetchTasks();
            setNewTask("");
            setNewDeadline("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const updateDueDate = async (taskId, deadline) => {
        try {
            await axios.put("https://mern-todo-back-wdqp.onrender.com", { taskId, deadline });
            fetchTasks();
        } catch (error) {
            console.error("Error updating due date:", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`https://mern-todo-back-wdqp.onrender.com${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const moveTask = async (taskId, direction) => {
        try {
            await axios.put("https://mern-todo-back-wdqp.onrender.com", { userEmail, taskId, direction });
            fetchTasks();
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    const completeTask = async (taskId) => {
        try {
            await axios.put("https://mern-todo-back-wdqp.onrender.com", { taskId });
            fetchTasks();
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    return (
        <div className={`task-container ${darkMode ? "dark" : ""}`}>
            <div className="header">
                <h2>Your Tasks</h2>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <div className="task-input">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task"
                />
                <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                <button onClick={addTask}>Add Task</button>
            </div>

            <ul className="task-list">
                {tasks.map((task, index) => (
                    <li key={task._id} className="task-item">
                        <span className="task-title">{task.title}</span>
                        <span className="task-date">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        <input
                            type="date"
                            defaultValue={task.deadline.split("T")[0]}
                            onChange={(e) => updateDueDate(task._id, e.target.value)}
                        />
                        <button className="delete-btn" onClick={() => deleteTask(task._id)}>❌</button>
                        <button className="move-btn" onClick={() => moveTask(task._id, "up")} disabled={index === 0}>⬆</button>
                        <button className="move-btn" onClick={() => moveTask(task._id, "down")} disabled={index === tasks.length - 1}>⬇</button>
                        <button className="complete-btn" onClick={() => completeTask(task._id)}>✅</button>
                    </li>
                ))}
            </ul>

            <h2>Completed Tasks</h2>
            <ul className="completed-list">
                {completedTasks.map((task) => (
                    <li key={task._id} className="completed-item">{task.title} ✅</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
