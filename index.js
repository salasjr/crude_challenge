const express = require('express')
const app = express()
const uuid = require('uuid');
const Joi = require('joi');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let persons = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.set('db', persons)
app.get("/person",(req,res)=>{
    res.json(persons)
})
// get request
app.get("/person/:id", (req, res) => {
    let filteredperson = persons.filter(p => p.id == req.params.id)
    if (filteredperson.length) {
        res.json(filteredperson[0])
    } else {
        res.sendStatus(404);
    }
})
// post request
app.post("/person",(req, res)=>{
    const persons = req.app.get('db');
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
        hobbies: Joi.array().items(Joi.string()).required()
    });
    const { error,value } = schema.validate(req.body)
    if (error) {
        res.status(400).json(error);

    } else {
        const person = {
            id: uuid.v4(),
            name: req.body.name,
            age: req.body.age,
            hobbies: req.body.hobbies|| []
        }
        persons.push(person)
        res.status(200).json(persons)
    }
    
})

// put request
app.put("/person/:id", (req, res) => {
    let personIdx = persons.findIndex(p => p.id == req.params.id);
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
        hobbies: Joi.array().items(Joi.string()).required()
    });
    const { error } = schema.validate(req.body);

    if (personIdx == -1) {
        res.sendStatus(404);
    } else if (error) {
        res.status(400).json(error);
    } else {
        let oldPerson = persons[personIdx];
        let person = {
            id: oldPerson.id,
            name: req.body.name,
            age: req.body.age,
            hobbies: req.body.hobbies || []
        };
        persons[personIdx] = person;
        res.sendStatus(200);
    }
});


// delete request
app.delete("/person/:id", (req, res) => {
    let deletedid = persons.findIndex(p => p.id == req.params.id)
    if (deletedid == -1) {
        res.sendStatus(404)
    } else {
        persons.splice(deletedid, 1)
        res.sendStatus(200)
    }
})

//cheacking non existance request
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

app.use((req, res) => {
  return res.status(500).json({ error: "Internal Server error" });
});

if (require.main === module) {
    app.listen(3000)
    console.log('listen')
}
module.exports = app;
