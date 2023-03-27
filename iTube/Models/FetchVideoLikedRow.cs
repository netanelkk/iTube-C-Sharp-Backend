using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class FetchVideoLikedRow : Video
    {
            private int views;
            private int count;
            private string picturePath;

        public FetchVideoLikedRow(int id, string title, string uploadDate, int duration, string videoPath, string thumbnailPath, int publisher, string password, string picturePath, int views, int count)
                : base(id, title, "", uploadDate, duration, videoPath, thumbnailPath, publisher, password)
               {
                this.views = views;
                this.count = count;
            this.picturePath = picturePath;
             }

            public int Views { get => views; set => views = value; }
            public int Count { get => count; set => count = value; }
            public string PicturePath { get => picturePath; set => picturePath = value; }
    }
}