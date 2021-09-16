'use strict'
const express = require('express')
const cors = require('cors')

const axios = require('axios')

require('dotenv').config();
const PORT = process.env.PORT
const server = express()
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE, { useNewUrlParser: true, useUnifiedTopology: true });


const choclateSchema = new mongoose.Schema({
    id: String,
    imageUrl: String,
    title: String,
    email:String
});
const itemStoreModel = mongoose.model('storeItem', choclateSchema);

server.get('/', getHandler);
server.get('/callApiData',apiHandlear);
server.post('/storeApiDatadb/:email',storedbHandlear);
server.get('/callFavortItem',favoratItemHandlear);
server.delete('/deleteItem/:id',deleteItemHandlear);
server.put('/upDateItem/:id',upDateItemHandlear);

////////////////////////////////////getHandler
function getHandler(req, res) {
    res.send("this server work")
}

///////////////////////////////////api data
/////////////http://localhost:3008/callApiData
function apiHandlear(req, res) {
    // console.log("inside getApiData");
    const url = 'https://ltuc-asac-api.herokuapp.com/allChocolateData';
    axios.get(url).then(apiCont => {
        let storeData = apiCont.data.map(storeCons => {
            return new choclatedataHitServer(storeCons)
        })
        // console.log(storeData,"storeData result");
        res.send(storeData)
    }).catch(error=>{
        // console.log(error,"get 3 api data erroe");
    })
    // console.log("getApidata");
}
/////////////////////////////////store in db
/////////////http://localhost:3008/storeApiDatadb
function storedbHandlear(req,res){
// console.log("storeApiDatadb server work");
const { title, imageUrl, id } = req.body
const email = req.params.email
itemStoreModel.find({ id: id }, (error, dataChoclate) => {
    if (dataChoclate.length > 0) {
        res.send("already exist")
    } else {
        let choclateData = new itemStoreModel({
            title: title,
            imageUrl: imageUrl,
            id: id,
            email: email

        })
        choclateData.save()
        // console.log(choclateData,"choclateData result");
        res.send(choclateData)
    }
})
// res.send("http://localhost:3008/storeApiDatadb work")
}
////////////////////////////////////favortItem
function favoratItemHandlear(req,res){
    const email = req.query.email
    itemStoreModel.find({ email: email }, (error, storeItem) => {
        console.log(storeItem,"storeItem result");
              res.send(storeItem)
    })
}
//////////////////////////////////////////deletItem
function deleteItemHandlear(req,res){
    console.log("deleteItemHandler");
    const id = req.params.id
    const email = req.query.email
    itemStoreModel.remove({ _id: id }, (error, dataItem1) => {
        itemStoreModel.find({ email: email }, (error, dataItem2) => {
            res.send(dataItem2)
        })
    })
}
/////////////////////////////////////updateItem
function upDateItemHandlear(req,res){
    const { imageUrl, title } = req.body
    console.log(req.body,"req.body result");
    console.log(req.body.imageUrl,"req.body.imageUrl result");
    console.log(req.body.title,"req.body.title result");
    const id = req.params.id
    itemStoreModel.findOne({ _id: id }, (error, storeData) => {
        if (storeData === null) {
            res.send("not exist")
        } else {
            storeData.imageUrl = imageUrl;
            storeData.title = title;
            
            storeData.save();
            res.send(storeData);

        }
    })
}
/////////////////////////////////////////////
class choclatedataHitServer {
    constructor(item) {
        this.title = item.title,
            this.imageUrl = item.imageUrl,
            this.id = item.id
    }
}

server.listen(PORT, () => {
    console.log("server listen perfectly",PORT);
})