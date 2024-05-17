// import express module

// make one debt object and just add/subtract from it 
//delete object if debt == 0

// declare variable as an instance of an express server

const express = require('express');
const app = express();
const PORT = 9000;
app.use( express.json())
const mongoose = require('mongoose')

//MONGO DB CLIENT SET UP

mongoose.connect(
    "mongodb+srv://BHTS:capitalONE@fintrack.teghebl.mongodb.net/?retryWrites=true&w=majority&appName=fintrack"
    );
    
const moneySchema = new mongoose.Schema({
    totalMoney: {
       type:Number,
       required: false
    },
    weeklyIncome: {
        type:Number,
        required: false
     },
     weeklySpending: {
        type:Number,
        required: false
     },
     totalDebt: {
        type:Number,
        required: false
     }

})


app.listen(9001, () => {

    console.log("server is running")
})
let debtArray = [];
let incomeArray = [];
let debtObject = {};
let incomeObject = {};
let debtTotal = 0;
let bankBalance = 0;

app.get("/about", (req, res) => {
	res.send("This is an API service that allows small businesses to keep track of their debts");
});

app.get("/debt/:id", (req, res) => {
    const { id } = req.params;

	const debt = debtObject[id];
    if (debt === undefined) {
        res.status(404).send("Debt not found");
    } else {
        const debtArrayString = debtArray.join(', ');
        res.send("your current debt balance is " + debtTotal + ". The following is every instance of debt ever: " + debtArrayString);
    }
});
app.get("/income/:id", (req, res) => {
    const { id } = req.params;

	const income = incomeObject[id];
    if (income === undefined) {
        res.status(404).send("Debt not found");
    } else {
        const incomeArrayString = incomeArray.join(', ');
        res.send("your current debt balance is " + debtTotal + ". The following is every instance of Income ever: " + incomeArrayString);

    }
});


app.listen(
    PORT, 
    () => console.log(`Server is running on port ${PORT}.`)
)

app.post('/debt/:id', (req, res) => { // creates a post request to allow the user to make new data on the server using a dynamic url
    const {id} = req.params; // ID is given by request parameters, you request WHERE it should be stored
    const { amount } = req.body // amount given by body of request.
    if (!id){
        res.status(418).send({ message: 'We need an ID to store data in'})
    }
 debtTotal = debtTotal + parseInt(amount);
 debtArray.push(amount);
 debtObject[id] = amount;

 moneyModel.findOneAndUpdate({}, { totalDebt: debtTotal }, { new: true })
 .then((updatedDocument) => {
     res.send({
         debt: `your debt balance has increased by ${amount} and debt is now ${debtTotal}`,
         totalMoney: updatedDocument
     });
 })
 .catch((err) => {
     res.status(500).json({ error: err.message });
 });



    
    })

app.post('/income/:id', (req, res) => { // creates a post request to allow the user to make new data on the server using a dynamic url
    const {id} = req.params; // ID is given by request parameters, you request WHERE it should be stored
    const { amount } = req.body // amount given by body of request.
    if (!id){
        res.status(418).send({ message: 'We need an ID to store data in'})
    }

    incomeArray.push(amount);
    debtTotal = debtTotal - amount;
    incomeObject[id] = amount;

    const totalEarned = debtArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    bankBalance = bankBalance + parseInt(amount)

    moneyModel.findOneAndUpdate({}, { totalMoney: bankBalance }, { new: true })
 .then((updatedDocument) => {
     res.send({
         debt: `your bank balance has increased by ${amount} $`,
         totalMoney: updatedDocument
     });
 })

 
    
});

app.post('/payDebt/:id', (req, res) => { // creates a post request to allow the user to make new data on the server using a dynamic url
    const {id} = req.params; // ID is given by request parameters, you request WHERE it should be stored
    const { amount } = req.body // amount given by body of request.

    if (!id){
        res.status(418).send({ message: 'We need an ID to store data in'})
    }

    if (debtTotal <= 0) {
        return res.status(200).json({ message: "No debt to pay" });
    }

    if (debtTotal + parseInt(amount) < 0){
        bankBalance = bankBalance - debtTotal
        debtTotal = 0
    }else {
        bankBalance = bankBalance - parseInt(amount)
        debtTotal = debtTotal - parseInt(amount)
    }




    moneyModel.findOneAndUpdate({}, { totalMoney: bankBalance }, { new: true })
    .then((updatedMoneyDocument) => {
        return moneyModel.findOneAndUpdate({}, { totalDebt: debtTotal }, { new: true })
            .then((updatedDebtDocument) => {
                res.send({
                    Income: `your bank balance has decreased by ${amount} $`,
                    totalMoney: bankBalance,
                    debt: `your debt has decreased by ${amount} $`,
                    totalDebt: debtTotal
                });
            });
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
    
});


const moneyModel = mongoose.model("totalMoney", moneySchema)
module.exports = moneyModel;

const sum = incomeArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

let totalEarned =sum; // Output: 15 (1 + 2 + 3 + 4 + 5)
const sum2 = debtArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
let totalSpent = sum2

const newMoney = new moneyModel({
    totalMoney: totalEarned - totalSpent, // Example value
    weeklyIncome: 500, // Example value
    weeklySpending: 300, // Example value
    totalDebt: debtTotal // Example value
});

app.get("/totalMoney", (req, res) =>{

    moneyModel.find({}).then(function(totalMoney){
        res.json(totalMoney)
    }).catch(function(err) {
        res.json(err);
    });
})
