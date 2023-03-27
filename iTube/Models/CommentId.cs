using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class CommentId
    {
            private int commentId;

            public CommentId(int commentId)
            {
                this.commentId = commentId;
            }

            public int GetCommentId()
            {
                return commentId;
            }
    }
}