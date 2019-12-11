var express = require('express');
var router = express.Router();
const Posts = require("../models/Posts");

const Joi = require('joi');
 
const post_schema = Joi.object().keys({
    post: Joi.string().required(),
});

const vote_schema = Joi.object().keys({
  like: Joi.boolean().required()
})
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  Posts.find({}, (err, data)=>{
    if(err){
      res.json({error:err, desp:"Error while finding posts"})
    } else{
      res.json({data:data, error:err});
    }
  })
});

router.post('/post', function(req, res, next){
  const validation = Joi.validate(req.body, post_schema );
  
  if(validation.error){
    res.json({error:validation.error, desp:"Please send valid post"})
  }else{

    Posts.count({},(err,count)=>{
      if(err){
        res.json({error:err, desp:"Error while counting posts"})
      }
  
      var post = new Posts()
      post.id = count+1
      post.post = req.body.post
      post.upVotes = 0
      post.downVotes = 0
  
      post.save((err, post)=>{
        if(err){
          res.json({error:err, desp:"Error Occured While Saving Post"})
        }
  
        res.json({post:post, desp:"Post saved successfully"})
      })
    })
  }
})

router.post('/vote/:id', (req, res, next)=>{
  const validation = Joi.validate(req.body, vote_schema );

  console.log(typeof req.body.like)
  
  if(validation.error || (typeof req.body.like) !== "boolean"){
    res.json({error:validation.error || "Please check the type of like", desp:"Please send valid vote"})
  } else{
    Posts.findOne({id:req.params.id}, (err, post)=>{
      if(err){
        res.json({error:err, desp:"Error occured while getting post"})
      }
      if(req.body.like){
        Posts.findOneAndUpdate({id:req.params.id}, {upVotes:post.upVotes+1}, {new:true}, (err, updpost)=>{
          if(err){
            res.json({error:err, desp:"Error occured while updating post"})
          }
          res.json({post:updpost, desp:"Updated post successfully"})
        })
      } else {
        Posts.findOneAndUpdate({id:req.params.id}, {downVotes:post.downVotes+1}, {new:true}, (err, updpost)=>{
          if(err){
            res.json({error:err, desp:"Error occured while updating post"})
          }
          res.json({post:updpost, desp:"Updated post successfully"})
        })
      }
    })
  }
})

module.exports = router;
