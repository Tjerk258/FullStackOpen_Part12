const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

// const updateRedis = async () => {
//   const todos = await Todo.find({})
//   redis.setAsync('todos', todos.length)
// }

// updateRedis()

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const count = await redis.getAsync('todos')
  await redis.setAsync('todos', Number(count)+1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.todo._id,
      {
        text: req.body.text || req.todo.text, // Update text if provided, otherwise keep the existing text
        done: req.body.done || req.todo.done, // Update done status if provided, otherwise keep the existing status
      },
      { new: true } // Return the updated todo
    );
    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
