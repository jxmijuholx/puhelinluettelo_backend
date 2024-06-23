require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./src/models/Person');

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
const format = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(format));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const date = new Date();
        const info = `
            <div>
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            </div>
        `;
        response.send(info);
    });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({ error: 'malformatted id' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end();
    }).catch(error => {
        console.log(error);
        response.status(500).send({ error: 'malformatted id' });
    });
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: 'Name is missing' });
    } else if (!body.number) {
        return response.status(400).json({ error: 'Number is missing' });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    }).catch(error => {
        console.log(error);
        response.status(500).send({ error: 'Error saving person' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
