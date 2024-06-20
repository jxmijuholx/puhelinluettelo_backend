const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())

app.use(express.json());

morgan.token('body', (req) => { return JSON.stringify(req.body);
});
const format = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(format));


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Jami Juhola",
        "number": "69-420",
        "id": 5
    }
];

console.log('Middleware activated');

app.get('/api/persons', (request, response) => {
    response.json(persons);
    console.log('GET', persons);
});

app.get('/info', (request, response) => {
    const date = new Date();
    const info = `
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        </div>
    `;
    response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
        console.log(person);
    }else{
        response.status(404).end();
        console.log('404 NOT FOUND');
    }
})

app.delete ('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
    console.log('Deleted');
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if(!body.name){
        return response.status(400).json({
            error: 'Nimi puuttuu bro'
        });
    }else if(!body.number){
        return response.status(400).json({
            error: 'Numero puuttuu bro'
        });
    
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000),

    };
    persons = persons.concat(person);
    response.json(person);
    console.log('onnistuit lisäämään tyypin');
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
