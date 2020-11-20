const { Router } = require('express');
const LogEntry = require('../models/LogEntry');
const { API_KEY } = process.env;
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.get('X-API-KEY') !== API_KEY) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    console.log(error.name);
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    if (req.get('X-API-KEY') !== API_KEY) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.body;
    console.log(id);
    const response = await LogEntry.findByIdAndUpdate({ _id: id }, req.body);
    res.json(response);
  } catch (error) {
    console.log(error.name);
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.get('X-API-KEY') !== API_KEY) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const response = await LogEntry.findByIdAndDelete(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
