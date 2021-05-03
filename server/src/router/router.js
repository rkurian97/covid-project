const express = require('express'),
personSchema= require('../model/person')
bcrypt= require('bcryptjs')
router= new express.Router()

//POST
router.post('/register', async (req, res)=>{
    console.log(req.body)
    const newPerson= new personSchema(req.body.person)
    newPerson.save().then(() =>{
        res.send(newPerson)
    }).catch((error) =>{
        console.log(error)
        res.send(error)
    })
})

//GET
//login
router.post('/login', async(req, res) =>{
    try{
        const person= req.body.person
        const email= person.email
        const password= person.password
        const foundPerson= await personSchema.findOne({email})
        if (!foundPerson){
            throw new Error({error: 'Invalid login details'})
        }
        const isValidPassword= await bcrypt.compare(password, foundPerson.password)
        if (!isValidPassword){
            res.send({error: 'Invalid login details'})
        }
        const token= await foundPerson.generateAuthToken()
        res.send({foundPerson, token})
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
//Retrieve One
router.post("search")
//GET by id
router.get('/persons/:id', async(req, res) =>{

    try{
        const selectPerson= await personSchema.findById(req.params.id)
        res.send(selectPerson)
    }catch(error){
        console.log(error)
        res.send(error)
    }

})

//Update
router.put('/persons/:id', async(req, res) =>{
    const person = new personSchema(req.body.person)
    const _id= person.id
    try{
        const selectPerson= await personSchema.findByIdAndUpdate(_id, person, {new: true})
        if(!selectPerson){
            return res.status(404).send()
        }else{
            res.send(selectPerson)
        }
    }catch(error){
        console.log(error)
        res.send(error)
    }
})

//Delete
router.delete('/persons/:id', async(req, res) =>{

    try{
        const deletedPerson= await personSchema.findByIdAndDelete(req.params.id)
        res.status(200)
    }catch(error){
        console.log(error)
        res.status(500).send(error)
    }

})

module.exports = router;