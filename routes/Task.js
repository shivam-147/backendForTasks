const express = require('express');
const router = express.Router();
const taskModel = require('../models/task.model');
const IsLoggedIn = require('../middleware/IsLoggedIn');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

router.post('/add-task', IsLoggedIn, async (req, res) => {

    try {
        const { title, content, status } = req.body
        const task = new taskModel({
            title,
            content,
            status,
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

router.get('/get-tasks', IsLoggedIn, async (req, res) => {
    try {
        const tasks = await taskModel.find({ user: req.user.userId })
        res.status(200).json(tasks)
    }
    catch (err) {
        res.status(500).json({ message: 'Error is getting tasks' })
    }
})

router.put('/update-task/:id', IsLoggedIn, async (req, res) => {
    try {

        const id = req.params.id
        const { title, content, status } = req.body
        const task = await taskModel.findOne({ _id: id })

        if (!title || !content || !status)
            res.status(400).json({ message: "title, content or status is missing" })

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

router.put('/update-status/:id', IsLoggedIn, async (req, res) => {

    try {
        const id = req.params.id
        const { checked } = req.body

        const task = await taskModel.findOne({ _id: id })
        task.status = checked ? 'completed' : 'pending'

        await task.save()
        res.status(200).json({ message: 'Status updated successfully' })
    }
    catch (err) {
        res.status.json({ message: 'Error at update status' })
    }
})

router.delete('/delete/:id', IsLoggedIn, async (req, res) => {
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