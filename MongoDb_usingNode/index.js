const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const client = require('mongodb').MongoClient;
const Objid = require('mongodb').ObjectId;
let alldata;
let studentsalldata;
const url = "mongodb://127.0.0.1:27017";
client.connect(url)
    .then((database) => {
        alldata = database.db("code");
        studentsalldata = alldata.collection("allusers");
        console.log('database connected');
    }).catch((error) => {
        console.log(error);
    })
app.get('/', (req, res) => {
    res.json({message:"Mongodb connected..."});
})

//*Get fetch data :
app.get('/getData', (req, res) => {
    //* convert find readble so use => toArray();
    studentsalldata.find({}).toArray().then((result) => {
        console.log(result);
        res.render("index", { data: result });
    }).catch((err) => {
        console.log(err);
    })
})

//*save data :
app.post('/storeData', (req, res) => {
    let object = {
        "username": req.body.username,
        "password": req.body.password
    }
    studentsalldata.insertOne(object).then((result) => {
        //console.log(result);
        //res.render("index",{data:result});
        res.redirect('/getData');
    }).catch((err) => {
        console.log(err);
    })
})
app.get('/add', (req, res) => {
    res.render('store');
})

//*views :
app.get('/view/:id', (req, res) => {  //covert into class
    console.log(req.params.id);
    alldata.collection("allusers").findOne({ "_id": new Objid(req.params.id) }).then((result) => {
        res.render('Student', { data: result });
    })
})

//* Hidden : 
app.get('/updateData/:id', (req, res) => {  //covert into class
    console.log(req.params.id);
    alldata.collection("allusers").findOne({ "_id": new Objid(req.params.id) }).then((result) => {
        res.render('Update', { data: result });
    })
})

//* Update :
app.post("/updateData", (req, res) => {
    alldata.collection("allusers").updateOne({ "_id": new Objid(req.body.id) }, { $set: { "username": req.body.username, "password": req.body.password } });
    res.redirect('/getData');
})
app.listen(port, () => {
    console.log(`Running the port no ${port}`);
})