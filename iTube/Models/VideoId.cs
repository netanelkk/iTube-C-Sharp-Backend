using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class VideoId
    {
        private int videoId;

        public VideoId(int videoId)
        {
            this.videoId = videoId;
        }

        public int GetVideoId()
        {
            return videoId;
        }
    }
}
