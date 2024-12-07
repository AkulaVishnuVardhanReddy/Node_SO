const {Client} = require('pg');
const express = require('express');

const app = express();
app.use(express.json());

const con = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"Chintu@",
    database:"nodejs_so"
})

con.connect().then(()=>console.log("Connected to database"))

app.post('/addUser',(req,res)=>{
    const {id,name} = req.body;
    const insert_query = 'insert into "User"(id,name) values($1,$2)';
    con.query(insert_query,[id,name],(err,result)=>{
        if(err) res.send(err);
        else {
            res.send("Posted")
        }
    })
})

app.get('/allUsers',(req,res)=>{
    const get_query = 'select * from "User"';
    con.query(get_query,(err,result)=>{
        if(err) res.send(err);
        else res.send(result.rows);
    })
})

app.get('/getUser/:id',(req,res)=>{
    const id = req.params.id;
    const get_query = 'select * from "User" where id = $1';
    con.query(get_query,[id],(err,result)=>{
        if(err) res.send(err);
        else{
            res.send(result.rows);
        }
    })
})

app.put('/changeUser/:id',(req,res)=>{
    const id = req.params.id;
    const {name} = req.body;
    const update_query = 'update "User" set name =$2 where id = $1';
    con.query(update_query,[id,name],(err,result)=>{
        if(err) res.send(err);
        else res.send(result);
    })
})

app.delete('/deleteUser/:id',(req,res)=>{
    const id = req.params.id;
    const delete_query = 'delete from "User" where id = $1';
    con.query(delete_query,[id],(err,response)=>{
        if(err) res.send(err)
        else res.send(response);
    })
})

app.listen(3000,()=>{
    console.log("The server is running");
})