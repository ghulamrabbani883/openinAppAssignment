const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoute.js');
const taskRoute = require('./routes/taskRoute.js');
const subtaskRoute = require('./routes/subTaskRoute.js');
const port = 3000;
require('./db/conn.js');

app.use(express.json())
app.use(cookieParser());

app.use('/user',userRoutes)
app.use('/task',taskRoute)
app.use('/subtask', subtaskRoute)


app.get('/' , (req , res)=>{
    console.log(Date.now())
   res.send('hello from OpeninApp server :)')
})

app.listen(port, ()=>console.log(`Server is listening at http://localhost:${port}`))