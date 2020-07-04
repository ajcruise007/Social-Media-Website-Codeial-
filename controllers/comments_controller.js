const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {

    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                    content: req.body.content,
                    user: req.user._id,
                    post: req.body.post
            });            
    
                //to push comment into array  of comments inside postSchema
                post.comments.push(comment);
                post.save();//To permanently save in the database

                if(req.xhr){
                    await comment.populate('user','-password').execPopulate();
                    return res.status(200).json({
                        data:{
                          comment: comment  
                        },
                        message: 'Comment added!' 
                        
                    });
                    
                }
    
                return res.redirect('/');
            }    
    } catch (err) {
        console.log('Error in creating comment',err);
        return;
    }

   
    }


// to delete a comment
module.exports.destroy = async function(req, res) {
    try{       
    let comment = await Comment.findById(req.params.id);
    console.log(comment);
                   
                   if (req.user.id == comment.user) {
                    let postId = comment.post;
                    comment.remove();
        
                    // to delete comment in the comments array of post using $pull command of mongodb
                  await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
                  if(req.xhr){
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: 'Comment Deleted!'
                    });
                }
                        
                        return res.redirect('back');
        
        } else {
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error in deleting comment!',err);
    }
    
}