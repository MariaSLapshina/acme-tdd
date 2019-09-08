const express = require('express')
const app = express()
const db = require('./db')
const { User, Department } = db.models
const inflection = require('inflection')
const { pluralize } = inflection


app.use(express.json())
app.use(require('cors')())
Object.entries(db.conn.models).forEach(([name,model])=>{
    app.get(`/api/${pluralize(name)}`, (req,res,next)=> {
        model.findAll()
        .then(items =>res.send(items))
        .catch(next)
    })
    
    app.post(`/api/${pluralize(name)}`, (req,res,next)=> {
       
        model.create(req.body)
        .then(item => res.status(201).send(item))
        .catch(next)
    })
    
    app.put(`/api/${pluralize(name)}/:id`, (req,res,next)=>{
        model.findByPk(req.params.id)
        .then(item => item.update(req.body))
        .then(item =>res.send(item))
        .catch(next)
    })
    
    app.delete(`/api/${pluralize(name)}/:id`, (req,res,next)=> {
        model.findByPk(req.params.id)
        .then(item => item.destroy())
        .then(()=> res.sendStatus(204))
    
    })
})


module.exports = app