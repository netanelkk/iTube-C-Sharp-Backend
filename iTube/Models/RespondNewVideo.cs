using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondNewVideo
    {
        private int id;
        private string thumbnailPath;

        public RespondNewVideo(int id, string thumbnailPath)
        {
            this.id = id;
            this.thumbnailPath = thumbnailPath;
        }

        public int Id { get => id; set => id = value; }
        public string ThumbnailPath { get => thumbnailPath; set => thumbnailPath = value; }
    }
}