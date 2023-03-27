using iTube.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class Comment
    {
        private int id;
        private int userId;
        private int videoId;
        private string date;
        private string content;

        public Comment(int id, int userId, int videoId, string date, string content)
        {
            this.id = id;
            this.userId = userId;
            this.videoId = videoId;
            this.date = date;
            this.content = content;
        }

        public static List<FetchComment> FetchComments(int videoId, int page)
        {
            DataServices ds = new DataServices();
            return ds.FetchComments(videoId, page);
        }

        public static Dictionary<string, int> TagMap(List<FetchComment> comments)
        {
            DataServices ds = new DataServices();
            return ds.TagMap(comments);
        }

        public static int CountComments(int videoId)
        {
            DataServices ds = new DataServices();
            return ds.CountComments(videoId);
        }

        public static FetchComment AddComment(int videoId, int userId, string content)
        {
            DataServices ds = new DataServices();
            return ds.AddComment(videoId, userId, content);
        }
        public static bool DeleteComment(int commentId, int userId)
        {
            DataServices ds = new DataServices();
            return ds.DeleteComment(commentId, userId);
        }


        public int Id { get => id; set => id = value; }
        public int UserId { get => userId; set => userId = value; }
        public int VideoId { get => videoId; set => videoId = value; }
        public string Date { get => date; set => date = value; }
        public string Content { get => content; set => content = value; }
    }
}