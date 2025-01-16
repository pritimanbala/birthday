var express = require('express');
var { connectDb , getDb} = require('./db');
var bodyParser = require('body-parser');
var app = express();
let db;
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine' , 'ejs');

app.use(express.static('public'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


connectDb((err) => {
    
    if(!err){
        const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
        db = getDb()
    }   
})


app.get('/all', (req, res) => {
    let people = [];

    db.collection('ecell').find({}).forEach((person) => {
        people.push(person);
    }).then(() => {
        res.render('all' , {'people' : people})
    }).catch(err => {
        res.status(500).json({ error: 'Could not fetch documents' });
    });
});

app.get('/' , (req,res)=>{
    res.render('home')
})

app.get('/find', (req, res) => {
    res.render('find');
});
app.post('/find',urlencodedParser, (req, res)=> {
    var name = req.body.name;
    if(!name){
        res.status(500).json({error : 'name is required'})
        return;
    }
    db.collection('ecell').findOne({name : name}).then(doc => {
        if(!doc){
            res.status(404).json({error : 'file not found'})
            return;
        }
        res.render('found' , { 'data' : doc});
    }).catch(err => {
        res.status(500).json({error : 'file cant be found'});
    })
})

app.get('/add' , (req, res) =>{
    res.render('add');
})
app.post('/add', urlencodedParser, (req, res) => {
    var data = req.body;
    if(!data.name || !data.bday){
        res.status(500).json({error : 'all the fields are required'})
        return ;
    }
    
        db.collection('ecell').insertOne({"name" : data.name, "bday" : data.bday}).then(()=>{
            res.render('success')
        }).catch(err => {
            res.render('failed');
        })
    
} )

app.get('/delete' , (req, res) =>{
    res.render('delete');
})
app.delete('/delete', urlencodedParser, (req, res) => {
    var data = req.body;
    if(!data.name || !data.bday){
        res.status(500).json({error : 'all the fields are required'})
    }
    db.collection('ecell').deleteOne({"name" : data.name, "bday" : data.bday}).then(()=>{
        res.render('success')
    }).catch(err => {
        res.render('failed');
    })
} )
