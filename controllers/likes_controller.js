const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res){
    try{

        // url: likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false; 

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if a like already exists delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            // else make a new like

            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user.id
            });
            likeable.likes.push(newLike.id);
            likeable.save();

        }

        return res.status(200).json({
            message: 'Request successful',
            data: {
                deleted: deleted
            }
        });

    }catch(err){
        console.log(err);
        return res.json(500, {
          message: 'Internal Server Error'  
        });
    }
}