// import express module

// make one debt object and just add/subtract from it 
//delete object if debt == 0


// declare variable as an instance of an express server
const express = require('express');
const app = express();
const PORT = 9000;
app.use( express.json())

let debtArray = [];
let incomeArray = [];
let debtObject = {};
let incomeObject = {};
let debtTotal = 0;

app.get("/about", (req, res) => {
	res.send("This is an API service that allows small businesses to keep track of their debts");
});

app.get("/debt/:id", (req, res) => {
    const { id } = req.params;

	const debt = debtObject[id];
    if (debt === undefined) {
        res.status(404).send("Debt not found");
    } else {
        res.send(debt);
    }
});
app.get("/income/:id", (req, res) => {
    const { id } = req.params;

	const income = incomeObject[id];
    if (income === undefined) {
        res.status(404).send("Debt not found");
    } else {
        res.send(income);
    }
});

app.listen(
    PORT, 
    () => console.log(`Server is running on port ${PORT}.`)
)

app.post('/debt/:id', (req, res) => { // creates a post request to allow the user to make new data on the server using a dynamic url
    const {id} = req.params; // ID is given by request parameters, you request WHERE it should be stored
    const { amount } = req.body // amount given by body of request.
    debtTotal = debtTotal + amount
    if (!id){
        res.status(418).send({ message: 'We need an ID to store data in'})
    }
 debtArray.push(amount);
 debtObject[id] = amount;

    res.send({
        debt: `your balance has decreased by ${amount} and debt is now ${debtTotal}`,
    
    })

    
});

app.post('/income/:id', (req, res) => { // creates a post request to allow the user to make new data on the server using a dynamic url
    const {id} = req.params; // ID is given by request parameters, you request WHERE it should be stored
    const { amount } = req.body // amount given by body of request.
    if (!id){
        res.status(418).send({ message: 'We need an ID to store data in'})
    }

    incomeArray.push(amount);
    debtTotal = debtTotal - amount
    incomeObject[id] = amount;

    res.send({
        income: `your balance has increased by ${amount} and debt is now ${debtTotal}`,

    })

    
});