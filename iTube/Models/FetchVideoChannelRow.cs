using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class FetchVideoChannelRow : Video
    {
        private int views;
        private int count;

        public FetchVideoChannelRow(int id, string title, string description, string uploadDate, int duration, string videoPath, string thumbnailPath, int publisher, string password, int views, int count)
            :base(id, title, description, uploadDate, duration,videoPath, thumbnailPath, publisher, password)
        {
            this.views = views;
            this.count = count;
        }

        public int Views { get => views; set => views = value; }
        public int Count { get => count; set => count = value; }
    }
}