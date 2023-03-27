using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondSubscriptions
    {
        private int id;
        private string username;
        private string picturePath;
        private int count;
        private int subscribers;

        public RespondSubscriptions(int id, string username, string picturePath, int count, int subscribers)
        {
            this.id = id;
            this.username = username;
            this.picturePath = picturePath;
            this.count = count;
            this.subscribers = subscribers;
        }

        public int Id { get => id; set => id = value; }
        public string Username { get => username; set => username = value; }
        public string PicturePath { get => picturePath; set => picturePath = value; }
        public int Count { get => count; set => count = value; }
        public int Subscribers { get => subscribers; set => subscribers = value; }
    }
}