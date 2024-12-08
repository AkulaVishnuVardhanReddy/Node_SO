const {Pool} = require("pg");
const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const pool = new Pool({connectionString:process.env.database_url});

app.use(bodyParser.json());

app.post('/registar',async(req,res)=>{
    const{username,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
         
        const result = await pool.query(
            'insert into users(username,password) values($1,$2) returning id',[username,hashedPassword]
        );

        res.status(201).json({message:"User is registred Successfully",userId:result.rows[0].id})
    }catch(error){
        res.status(400).json({error:error.message});
    }
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    try{
        const result = await pool.query("select * from users where username = $1",[username]);
        if(result.rows.length==0){
            return res.status(400).json({error:"Invalid Credentials"});
        }
        
        const user = result.rows[0];
        console.log(user);
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.status(400).json({error:"Invalid Credentials"});
        }

        const token = jwt.sign({userId:user.id},process.env.jwt_secret,{expiresIn:'1h'});

        res.json({message:'Login Successfull',token});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

const authenticateToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(" ")[1];

    if(!token)
        return res.status(401).json({error:"Access Denied"});

    try{
        const verified = jwt.verify(token,process.env.jwt_secret);
        req.user = verified;
        next();
    }catch(error){
        return res.status(401).json({error:"Invalid token"});
    }
}

app.post('/items',authenticateToken,async(req,res)=>{
    const{name,description} = req.body;
    try{
        const result = await pool.query(
            "insert into items(name,description,users_id) values($1,$2,$3)",
            [name,description,req.user.userId]);
        return res.status(201).json(result.rows[0]);
        
    }catch(error){
        return res.status(401).json({error:error.message});
    }
})

app.get('/items',authenticateToken,async(req,res)=>{
    try{
        const result = await pool.query(
            "select * from items where users_id=$1",[req.user.userId]);
        return res.status(201).json(result.rows);
        
    }catch(error){
        return res.status(401).json({error:error.message});
    }
})

app.put('/items/:id',authenticateToken,async(req,res)=>{
    const id = parseInt(req.params.id);
    const{name,description} = req.body;
    try{
        const result = await pool.query(
            "update items set name = $1 , description = $2 where id = $3 and users_id = $4 returning *",
            [name,description,id,req.user.userId]);
        return res.status(201).json(result.rows);
        
    }catch(error){
        return res.status(401).json({error:error.message});
    }
})

app.delete('/items/:id',authenticateToken,async(req,res)=>{
    const id = req.params.id;
    try{
        const result = await pool.query("delete from items where id=$1 and users_id=$2",[id,req.user.usersId]);
        return res.status(201).json({message:"Deleted"})
    }
    catch(error){
        return res.status(401).json({error:error.message})
    }
})


app.listen(process.env.port,()=>{
    console.log(process.env.port);
})