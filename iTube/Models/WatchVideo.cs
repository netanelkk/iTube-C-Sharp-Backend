using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    // Object for video to watch
    public class WatchVideo : Video
    {
        private string username;
        private string picturePath;
        private int userId;
        private int views;
        private int likes;
        private int subscribers;
        private int didLike;

        public WatchVideo(int id, string title,string description, string uploadDate, int duration, string videoPath, string thumbnailPath,
                          int publisher, string username, int userId, string picturePath, int views, int likes, int subscribers, int didLike)
                     : base(id, title, description, uploadDate, duration, videoPath, thumbnailPath, publisher, "")
        {
            this.username = username;
            this.picturePath = picturePath;
            this.userId = userId;
            this.views = views;
            this.likes = likes;
            this.subscribers = subscribers;
            this.didLike = didLike;
        }

        // In case of error, return object with username containing the error
        public WatchVideo(string error)
            : base(0, "", "", "", 0, "", "", 0, "")
        {
            username = error;
        }

        public string Username { get => username; set => username = value; }
        public string PicturePath { get => picturePath; set => picturePath = value; }
        public int UserId { get => userId; set => userId = value; }
        public int Views { get => views; set => views = value; }
        public int Likes { get => likes; set => likes = value; }
        public int Subscribers { get => subscribers; set => subscribers = value; }
        public int DidLike { get => didLike; set => didLike = value; }
    }
}