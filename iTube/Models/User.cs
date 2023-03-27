using iTube.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace iTube.Models
{
    public class User
    {
        private int id;
        private string username;
        private string password;
        private string email;
        private string picturePath;
        private string registerDate;
        private string about;

        public User(int id, string username, string password, string email, string picturePath, string registerDate, string about)
        {
            this.id = id;
            this.username = username;
            this.password = password;
            this.email = email;
            this.picturePath = picturePath;
            this.registerDate = registerDate;
            this.about = about;
        }

        public User Login()
        {
            DataServices ds = new DataServices();
            return ds.Login(username,password);
        }

        public string Register()
        {
            DataServices ds = new DataServices();
            return ds.Register(username, password, email);
        }

        public static RespondChannel UserDetails(int userId, int myUserId)
        {
            DataServices ds = new DataServices();
            return ds.UserDetails(userId, myUserId);
        }

        public static List<FetchVideoChannelRow> ChannelUploadedVideos(int userId, int page, int myUserId)
        {
            DataServices ds = new DataServices();
            return ds.ChannelUploadedVideos(userId, page, myUserId);
        }

        public static bool Subscribe(int userId, int subscribedTo)
        {
            DataServices ds = new DataServices();
            return ds.Subscribe(userId, subscribedTo);
        }

        public static bool Unsubscribe(int userId, int subscribedTo)
        {
            DataServices ds = new DataServices();
            return ds.Unsubscribe(userId, subscribedTo);
        }

        public static List<RespondSubscriptions> Subscriptions(int userId, int page)
        {
            DataServices ds = new DataServices();
            return ds.Subscriptions(userId, page);
        }

        public static List<FetchVideoRow> FetchSubscriptions(int userId)
        {
            DataServices ds = new DataServices();
            return ds.FetchSubscriptions(userId);
        }

        public static RespondChannel MyDetails(int userId)
        {
            DataServices ds = new DataServices();
            return ds.MyDetails(userId);
        }

        public static int UpdateDetails(string email, string newPassword, string oldPassword, int userId)
        {
            DataServices ds = new DataServices();
            return ds.UpdateDetails(email, (newPassword.Length==0) ? oldPassword : newPassword, oldPassword, userId);
        }

        public static List<User> UserSearch(string username, int ignore)
        {
            DataServices ds = new DataServices();
            return ds.UserSearch(username, ignore);
        }

        public static List<FetchVideoLikedRow> ChannelLiked(int userId, int isOwner, int page)
        {
            DataServices ds = new DataServices();
            return ds.ChannelLiked(userId, isOwner, page);
        }

        public static bool UpdateProfile(string about, int userId)
        {
            DataServices ds = new DataServices();
            return ds.UpdateProfile(about, userId);
        }

        public static TotalViews TotalViews(int userId)
        {
            DataServices ds = new DataServices();
            return ds.TotalViews(userId);
        }

        public static string UpdatePicture(string picturePath, int userId)
        {
            DataServices ds = new DataServices();
            return ds.UpdatePicture(picturePath, userId);
        }

        public static string GenerateNamePath()
        {
            string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            char[] stringChars = new char[10];
            var random = new Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(stringChars);
        }

        // Static method for base64 decode (user authorization)
        public static int Base64De(string str)
        {
            try
            {
                byte[] data = Convert.FromBase64String(str);
                return int.Parse(Encoding.UTF8.GetString(data));
            } catch (Exception)
            {
                return 0;
            }
        }

        // Static method for base64 encode (user authorization)
        public static string Base64En(int userId)
        {
            try
            {
                var plainTextBytes = Encoding.UTF8.GetBytes(userId.ToString());
                return Convert.ToBase64String(plainTextBytes);
            }
            catch (Exception)
            {
                return "";
            }
        }

        public int Id { get => id; set => id = value; }
        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Email { get => email; set => email = value; }
        public string PicturePath { get => picturePath; set => picturePath = value; }
        public string RegisterDate { get => registerDate; set => registerDate = value; }
        public string About { get => about; set => about = value; }
    }
}