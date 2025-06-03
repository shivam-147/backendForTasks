const express = require('express');
const router = express.Router();
const taskModel = require('../models/task.model');
const authenticateToken = require('../middleware/authenticateToken');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

router.post('/add-task', authenticateToken, async (req, res) => {

    try {
        const { title, content } = req.body
        const task = new taskModel({
            title,
            content,
            status: 'pending',
            user: req.user.userId
        })
        await task.save()

        const user = await userModel.findOne({ email: req.user.email })
        user.tasks.push(task._id)
        await user.save()

        res.status(200).json('task added successfully')
    }
    catch (err) {
        res.status(500).json({ message: 'Error at adding task' })
    }
})

router.get('/get-tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await taskModel.find({ user: req.user.userId })
        res.status(200).json({ error: false, tasks })
    }
    catch (err) {
        res.status(500).json({ error: true, message: 'Error is getting tasks' })
    }
})

router.put('/update-task/:id', authenticateToken, async (req, res) => {
    try {

        const id = req.params.id
        const { title, content, status = 'pending' } = req.body
        const task = await taskModel.findOne({ _id: id })

        if (!title || !content || !status)
            res.json({ error: true, message: "title, content or status is missing" })

        task.title = title
        task.content = content
        task.status = status

        await task.save()

        res.status(200).json({ message: 'Task is updated' })
    }
    catch (err) {
        res.status(500).json({ message: 'Error is updating' })
    }
})

router.put('/update-status/:id', authenticateToken, async (req, res) => {

    try {
        const id = req.params.id

        const task = await taskModel.findOne({ _id: id })
        task.status = task.status === 'pending' ? 'completed' : 'pending'

        await task.save()
        res.status(200).json({ message: 'Status updated successfully' })
    }
    catch (err) {
        res.status.json({ message: 'Error at update status' })
    }
})

router.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id
        await taskModel.deleteOne({ _id: id })

        res.status(200).json({ message: "task deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ message: "Error at deleting task" })
    }
})

module.exports = router;