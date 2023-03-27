using iTube.Models.DAL;
using MediaToolkit;
using MediaToolkit.Model;
using MediaToolkit.Options;
using Microsoft.WindowsAPICodePack.Shell;
using Microsoft.WindowsAPICodePack.Shell.PropertySystem;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Xabe.FFmpeg;

namespace iTube.Models
{
    public class Video
    {
        public const string VIDEOS_PATH = "Content/videos";
        public const string VIDEOS_THUMBNAILS_PATH = "Content/video_thumbnails";

        private int id;
        private string title;
        private string description;
        private string uploadDate;
        private int duration;
        private string videoPath;
        private string thumbnailPath;
        private int publisher;
        private string password;

        public Video(int id, string title, string description, string uploadDate, int duration, string videoPath, string thumbnailPath, int publisher, string password)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.uploadDate = uploadDate;
            this.duration = duration;
            this.videoPath = videoPath;
            this.thumbnailPath = thumbnailPath;
            this.publisher = publisher;
            this.password = password;
        }

        public static List<FetchVideoRow> FetchTrending()
        {
            DataServices ds = new DataServices();
            return ds.FetchTrending();
        }

        public static List<FetchVideoRow> FetchPopular()
        {
            DataServices ds = new DataServices();
            return ds.FetchPopular();
        }

        public static List<FetchVideoRow> FetchNew()
        {
            DataServices ds = new DataServices();
            return ds.FetchNew();
        }

        public static WatchVideo Watch(int videoId, string password, int userId)
        {
            DataServices ds = new DataServices();
            return ds.Watch(videoId, password, userId);
        }

        public static string Like(int videoId, int userId)
        {
            DataServices ds = new DataServices();
            return ds.Like(videoId, userId);
        }

        public static void AddView(int videoId, int userId, string ip)
        {
            DataServices ds = new DataServices();
            ds.AddView(videoId, userId, ip);
        }

        public static List<FetchVideoRow> AlsoLike(int videoId)
        {
            DataServices ds = new DataServices();
            return ds.AlsoLike(videoId);
        }

        public static RespondDataSearch<FetchVideoRow> SearchVideo(string query, int page, string[] orderby)
        {
            DataServices ds = new DataServices();
            if (orderby == null)
                orderby = new string[2] { "", "" }; // if no filter was applied, it will send an empty array
            if (orderby.Length == 0)
                orderby = new string[2] { "", "" }; // if no filter was applied, it will send an empty array
            return ds.SearchVideo(query, page, orderby);
        }

        public static List<FetchVideoRow> SuggestVideo(string query)
        {
            DataServices ds = new DataServices();
            return ds.SuggestVideo(query);
        }

        public static List<FetchVideoHistoryRow> FetchHistory(int userId, int page)
        {
            DataServices ds = new DataServices();
            return ds.FetchHistory(userId, page);
        }

        public static List<FetchVideoRow> FetchLikes(int userId, int page)
        {
            DataServices ds = new DataServices();
            return ds.FetchLikes(userId, page);
        }

        public static int CountHistory(int userId)
        {
            DataServices ds = new DataServices();
            return ds.CountHistory(userId);
        }

        public static int CountLikes(int userId)
        {
            DataServices ds = new DataServices();
            return ds.CountLikes(userId);
        }

        public static bool UpdateTitle(int videoId, int userId, string title)
        {
            DataServices ds = new DataServices();
            if (title.Length == 0)
                return false;
            return ds.UpdateTitle(videoId, userId, title);
        }

        public static bool UpdatePrivate(int videoId, int userId, string password)
        {
            DataServices ds = new DataServices();
            return ds.UpdatePrivate(videoId, userId, password);
        }

        public static bool DeleteVideo(int videoId, int userId)
        {
            DataServices ds = new DataServices();
            return ds.DeleteVideo(videoId, userId);
        }

        public static int AddVideo(Video video)
        {
            DataServices ds = new DataServices();
            return ds.AddVideo(video);
        }

        // Calculating video duration in seconds
        public static double CalculateDuration(string videoPath)
        {
            string filePath = Path.Combine(HostingEnvironment.MapPath("~/" + VIDEOS_PATH), videoPath);
            using (var shell = ShellObject.FromParsingName(filePath))
            {
                IShellProperty prop = shell.Properties.System.Media.Duration;
                var t = (ulong)prop.ValueAsObject;
                return TimeSpan.FromTicks((long)t).TotalSeconds;
            }
        }

        // Generating video thumbnail
        public static void GenerateThumbnail(string videoPath, string uniqueName)
        {
            using (var engine = new Engine())
            {
                string filePath = Path.Combine(HostingEnvironment.MapPath("~/" + VIDEOS_PATH), videoPath);
                string thumbSavePath = Path.Combine(HostingEnvironment.MapPath("~/" + VIDEOS_THUMBNAILS_PATH), uniqueName+".jpg");
                var mp4 = new MediaFile { Filename = filePath };

                engine.GetMetadata(mp4);

                int middle = Convert.ToInt32(mp4.Metadata.Duration.TotalSeconds / 2);
                var options = new ConversionOptions { Seek = TimeSpan.FromSeconds(middle) };
                var outputFile = new MediaFile { Filename = thumbSavePath };
                engine.GetThumbnail(mp4, outputFile, options);
            }
        }

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Description { get => description; set => description = value; }
        public string UploadDate { get => uploadDate; set => uploadDate = value; }
        public int Duration { get => duration; set => duration = value; }
        public string VideoPath { get => videoPath; set => videoPath = value; }
        public string ThumbnailPath { get => thumbnailPath; set => thumbnailPath = value; }
        public int Publisher { get => publisher; set => publisher = value; }
        public string Password { get => password; set => password = value; }
    }
}