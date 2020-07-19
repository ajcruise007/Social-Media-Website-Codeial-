

let createComment = function(postId){
    console.log('u called me',postId);
let newCommentForm = $(`#post-${postId}-comments-form`);
console.log(newCommentForm);
    newCommentForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: newCommentForm.serialize(),
            success: function(data){
                console.table(data);
                let commentList = $(`#post-comments-${postId}`);
                console.log(commentList)
                let newComment = newCommentDom(data.data.comment);
                commentList.prepend(newComment);
                console.log($(' .delete-comment-button', newComment))
                deleteComment($(' .delete-comment-button', newComment));
               new ToggleLike($(' .toggle-like-button', newComment));


                new Noty({
                    theme: 'relax',
                    text: "Comment Ppublished!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            },error: function(error){
                console.log(error.responseText);
            }
        });
    });
} 

let deleteComment = function(deleteLink){
    console.log('u are calling delete');
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#comment-${data.data.comment._id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "Comment Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            }, error: function(error){
                console.log(error.responseText);
            }
        });

    });
}



newCommentDom = function(comment){
    return $(`<li id='comment-${comment._id}'>
    <p>
       
        <small>
            <a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a>
        </small>
        ${comment.content}
        <br>
        <small> ${comment.user.name}</small>
        <br>
        <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                    0 likes
                </a>

        </small>
    </p>
</li`);
}

