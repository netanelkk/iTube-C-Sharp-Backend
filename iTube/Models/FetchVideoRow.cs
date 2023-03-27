using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    // Object for fetched videos rows
    public class FetchVideoRow : Video
    {
        private string username;
        private string picturePath;
        private int userId;
        private int views;

        public FetchVideoRow(int id, string title, string uploadDate, int duration, string videoPath, string thumbnailPath, int publisher, string username, string picturePath, int userId, int views)
            :base(id, title, "", uploadDate, duration, videoPath, thumbnailPath, publisher, "")
        {
            this.username = username;
            this.picturePath = picturePath;
            this.userId = userId;
            this.views = views;
        }

        public string Username { get => username; set => username = value; }
        public string PicturePath { get => picturePath; set => picturePath = value; }
        public int UserId { get => userId; set => userId = value; }
        public int Views { get => views; set => views = value; }
    }
}