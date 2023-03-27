using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class PicturePath
    {
        private string picturePath;

        public PicturePath(string picturePath)
        {
            this.picturePath = picturePath;
        }

        public string GetPicturePath()
        {
            return (picturePath == null) ? "" : picturePath;
        }
    }
}