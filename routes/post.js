const express = require('express')
const os = require('os');
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const fs = require('fs'), http = require('http'), https = require('https');
/*const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: *
    secretAccessKey: *
    region: 'eu-west-1'
});
const rekognition = new AWS.Rekognition();
var params = {
    Image: {
        S3Object: {
            Bucket: "shutbucket1",
            Name: "WIN_20211214_20_10_10_Pro.jpg"
        },
        "MaxLabels": 10,
        "MinConfidence": 50
        
    },
}


/*var Stream = require('stream').Transform;
function downloadImageFromURL (url, callback) {
    http.request(url, function(response) {
        var data = new Stream();

        response.on('data', function(chunk) {
            data.push(chunk);
        });

        response.on('end', function() {
            return data
        });
    }).end();
    
    return null;
};

var Stream = require('stream').Transform;
const { rejects } = require('assert')
  
function downloadImageFromURL(url, callback) {
    return new Promise((resolve, reject)=>{
        var client = http;
        if (url.toString().indexOf("https") === 0){
          client = https;
         }
        client.request(url, function(response) {                                        
            var data = new Stream();                                                    
      
          response.on('data', function(chunk) {                                       
             data.push(chunk);                                                         
          });                                                                         
      
          response.on('end', function() {                        
            resolve(data)                             
          });   
          console.log("111")                                                                      
       }).end();
       reject("why")
              

    })
                                                   

}

function imageToAWSLabels(image){
    return new Promise((resolve, reject)=>{
        var thing
        rekognition.detectLabels(image,function(err,data) {
            if(err) console.log(err,err.stack);
            else resolve(data)
        })
        reject("rejected")

    })
}

function returnLabelsAWS(picUrl) {
    console.log(os.freemem())
    console.log(os.userInfo())
    downloadImageFromURL(picUrl)
    .then(res=>imageToAWSLabels(res)
    .then(console.log(res)
    .catch(err=>console.log(err)))
    ).catch(err=>console.log(err))


    console.log("333")
    
}

*/
// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new bitmap.toString('base64');
}
/*
function xdd(image) {
    return new Promise((resolve,reject)=>{
        rekognition.detectLabels(image, (err,data)=>{
            if(err) reject(err);
            else {
                console.log(data)
                resolve(data)
            }
        })
    })
}

function xddd(imageUrl) {
    
    
    
}

console.log("stuff")
console.log(xddd(params))
 */
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate('postedBy','_id name')
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

//subscribed
router.get('/getsubpost',requireLogin,(req,res)=>{

    //if postedby in following list
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy','_id name')
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res)=>{
    /*let request = require('request').defaults({ encoding: null });

    request.get('http://tinypng.org/images/example-shrunk-8cadd4c7.png', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            console.log(data);
        }
    }).catch(err=>console.log(err))*/
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json(mypost)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    
    console.log(title,body,pic)
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    
    req.user.password = undefined

        const post = new Post({
            title,
            body,
            photo:pic,
            postedBy:req.user
    
        })
        post.save().then(result=>{
            res.json({post:result})
        })
        .catch(err=>{
            console.log(err)
        })

    
    

})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true  
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true  
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true  
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    console.log("xddddd")
    Post.findOne({_id:req.params.postId})
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,post)=>{
        if(err || !post)
            return res.status(422).json({error:err})
        if(post.postedBy._id.toString() == req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router