const express = require('express');
const bodyparser=require('body-parser');
const app=express();

/*app.use("/",require('./routes/pagesRoutes'));
app.use("task",require('./routes/taskRoutes'));*/
app.use("/account",require('./routes/accountRoutes'))
app.listen(3000,()=>{
    console.log('Listening on port 3000');
})