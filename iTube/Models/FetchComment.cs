using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class FetchComment : Comment
    {
        private string username;

        public FetchComment(int id, int userId, int videoId, string date, string content, string username)
            : base(id, userId, videoId, date, content)
        {
            this.username = username;
        }

        public string Username { get => username; set => username = value; }
    }
}