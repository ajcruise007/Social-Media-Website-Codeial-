const Post = require('../models/post');
const Comment = require('../models/comment');

// create post
module.exports.create = async function (req, res) {
    
    try{
            console.log(req.body.post_id);
            let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        await post.populate('user', '-password').execPopulate();
        
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post
                },
                message: 'Post Created!'
            });
        }
        req.flash('success','Post created!');
        return res.redirect('back');
    
    }catch(err){
        req.flash('error',err);

        return res.redirect('back');

    }
    
    
}

//Delete post
module.exports.destroy = async function (req, res) {
    try {
           let post = await Post.findById(req.params.id);
            
         
           
           // .id converts object id to string
            if (post.user == req.user.id) {
                post.remove();
                await Comment.deleteMany({ post: req.params.id });
                
                if(req.xhr){
                 
                    return res.status(200).json({

                        data:{
                            post_id: req.params.id
                        }, 
                        message: 'Post deleted!'
                    });
                }  
                req.flash('success','Post deleted!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Post cannot be deleted!');
                return res.redirect('back');
            }


               
        }
        catch (err) {
        req.flash('error',err);
        
        return res.redirect('back');
    
    }
}

