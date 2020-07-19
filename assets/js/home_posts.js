{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
        
        
        // Create ajax request
        $.ajax({
            type: 'post',
            url: '/posts/create',
            data: newPostForm.serialize(),
            success: function(data){
                // console.log(data);
                new Noty({
                    theme: 'relax',
                    text: "Post created!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
               let newPost = newPostDom(data.data.post);

               new ToggleLike($(' .toggle-like-button', newPost));
                console.log(data.data.post._id);//
               $('#posts-list-container>ul').prepend(newPost);
               deletePost($(' .delete-post-button', newPost));
               createComment(data.data.post._id);//bro ye kyu kia ahai maine neeche call kia hai??jab naya post create hoga tab kaha par call kiya h..neeche to un post ke liye h jo already created hacha okk...
              
            }, error: function(error){
                console.log(error.responseText);
            }
        });
    });
    }

    // method to create post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
            <br>
            <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 likes
                    </a>

            </small>
        </p>


        <div class="post-comments">
            <form action="/comments/create" method="POST" id ='post-${ post._id }-comments-form'>
                <input type="text" name="content" placeholder="Type here to add comment..." required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>

            <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
               
                    </ul>
        </div>
    
        </div>
        </p>
    </li>`);
    }

    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).on('click',function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    // console.log(data);
                    new Noty({
                        theme: 'relax',
                        text: "Post deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    $(`#post-${data.data.post_id}`).remove();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

   // Delete post on page by jQuery
    
   
   let convertPostsToAjax = function(){
       $('#display-posts>li').each(function(){
        //    console.log($(this));
           let self = $(this);
           let deleteButton = $(' .delete-post-button', self);
           deletePost(deleteButton);

           let postId = self.prop('id').split('-')[1];
           createComment(postId);
           
           
       });
       $('.delete-comment-button').each(function(){
           let self = $(this);
           deleteComment(self);
       }) 

       


    }
    
    convertPostsToAjax();
    createPost();
}