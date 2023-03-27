using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;

namespace iTube.Models.DAL
{
    public class DataServices
    {
        // Fixed values for rows in page. Notice that needed to be changed in client also!!
        private const int PAGE_OFFSET = 12;
        private const int COMMENT_PAGE_OFFSET = 15;

        // Update profile picture
        public int AddVideo(Video video)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("title", video.Title);
                command.Parameters.AddWithValue("description", video.Description);
                command.Parameters.AddWithValue("duration", video.Duration);
                command.Parameters.AddWithValue("videoPath", video.VideoPath);
                command.Parameters.AddWithValue("thumbnailPath", video.ThumbnailPath);
                command.Parameters.AddWithValue("publisher", video.Publisher);
                command.Parameters.AddWithValue("password", video.Password);

                command.CommandText = "spAddVideo";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                return (int)command.ExecuteScalar();
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Update profile picture
        public string UpdatePicture(string picturePath, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("picturePath", picturePath);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spUpdatePicture";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                string oldPicturePath = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        oldPicturePath = dr["picturePath"].ToString();
                    }
                }
                con.Close();
                return oldPicturePath;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Count total views of a channel 6 months ago
        public TotalViews TotalViews(int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spTotalViews";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                TotalViews totalViews = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        totalViews = new TotalViews(int.Parse(dr["count6"].ToString()),
                                                    int.Parse(dr["count5"].ToString()),
                                                    int.Parse(dr["count4"].ToString()),
                                                    int.Parse(dr["count3"].ToString()),
                                                    int.Parse(dr["count2"].ToString()),
                                                    int.Parse(dr["count"].ToString()));
                    }
                }
                con.Close();
                return totalViews;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Update profile details
        public bool UpdateProfile(string about, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("about", about);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spUpdateProfile";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch liked videos of channel
        public List<FetchVideoLikedRow> ChannelLiked(int userId, int isOwner, int page)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("isOwner", isOwner);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);

                command.CommandText = "spChannelLiked";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoLikedRow> videos = new List<FetchVideoLikedRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoLikedRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["password"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["views"].ToString()),
                                        int.Parse(dr["count"].ToString())));
                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Search username [used for tagging]
        public List<User> UserSearch(string username, int ignore)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("username", username);
                command.Parameters.AddWithValue("ignore", ignore);

                command.CommandText = "spUserSearch";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<User> users = new List<User>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        users.Add(new User(0, dr["username"].ToString(), "", "", dr["picturePath"].ToString(), "", ""));
                    }
                }
                con.Close();
                return users;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Delete comment
        public bool DeleteComment(int commentId, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("commentId", commentId);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spDeleteComment";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Delete video
        public bool DeleteVideo(int videoId, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spDeleteVideo";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        string videoPath = dr["videoPath"].ToString();
                        string thumbnailPath = dr["thumbnailPath"].ToString();

                        File.Delete(Path.Combine(HostingEnvironment.MapPath("~/Content/videos/"), videoPath));
                        File.Delete(Path.Combine(HostingEnvironment.MapPath("~/Content/video_thumbnails/"), thumbnailPath));
                    }
                }
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        
        }


        // Update video to be private with a password, or make it public
        public bool UpdatePrivate(int videoId, int userId, string password)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("password", password);

                command.CommandText = "spUpdatePrivate";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Update video title
        public bool UpdateTitle(int videoId, int userId, string title)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("title", title);

                command.CommandText = "spUpdateTitle";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Update user's details
        public int UpdateDetails(string email, string newPassword, string oldPassword, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("email", email);
                command.Parameters.AddWithValue("newPassword", newPassword);
                command.Parameters.AddWithValue("oldPassword", oldPassword);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spUpdateDetails";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int count = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        count++;
                    }
                }
                con.Close();
                return count;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch my user details
        public RespondChannel MyDetails(int userId)
        {
            return UserDetails(userId, 0);
        }

        // Count number of videos in history page
        public int CountLikes(int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", 0);
                command.Parameters.AddWithValue("next", 0); // flag for counting

                command.CommandText = "spFetchLikes";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int count = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        count++;
                    }
                }
                con.Close();
                return count;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Count number of videos in history page
        public int CountHistory(int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", 0);
                command.Parameters.AddWithValue("next", 0); // flag for counting

                command.CommandText = "spFetchHistory";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int count = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        count++;
                    }
                }
                con.Close();
                return count;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch viewed videos of user [history video page]
        public List<FetchVideoHistoryRow> FetchHistory(int userId, int page)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);

                command.CommandText = "spFetchHistory";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoHistoryRow> videos = new List<FetchVideoHistoryRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoHistoryRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["username"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["userId"].ToString()),
                                        int.Parse(dr["views"].ToString()),
                                        dr["historyDate"].ToString()
                                        ));
                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch liked videos of user [liked video page]
        public List<FetchVideoRow> FetchLikes(int userId, int page)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();
                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);

                command.CommandText = "spFetchLikes";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoRow> videos = new List<FetchVideoRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["username"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["userId"].ToString()),
                                        int.Parse(dr["views"].ToString())));
                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch videos of my subscriptions [subscriptions page]
        public List<FetchVideoRow> FetchSubscriptions(int userId)
        {
            return FetchVideoRow("spFetchSubscriptions", null, userId);
        }

        // Subscription list of {userId}
        public List<RespondSubscriptions> Subscriptions(int userId, int page)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);

                command.CommandText = "spSubscription";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<RespondSubscriptions> subscriptions = new List<RespondSubscriptions>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        subscriptions.Add(new RespondSubscriptions(int.Parse(dr["id"].ToString()),
                                                      dr["username"].ToString(),
                                                      dr["picturePath"].ToString(),
                                                      int.Parse(dr["count"].ToString()),
                                                      int.Parse(dr["subscribers"].ToString())
                                                      ));
                    }
                }
                con.Close();
                return subscriptions;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Unsubscribe user to channel
        public bool Unsubscribe(int userId, int subscribedTo)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("subscribedTo", subscribedTo);

                command.CommandText = "spUnsubscribe";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Subscribe user to channel
        public bool Subscribe(int userId, int subscribedTo)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("subscribedTo", subscribedTo);

                command.CommandText = "spSubscribe";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // List of all uploaded videos of given channel
        public List<FetchVideoChannelRow> ChannelUploadedVideos(int userId, int page, int myUserId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();
                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);

                command.CommandText = "spChannelUploadedVideos";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoChannelRow> videos = new List<FetchVideoChannelRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        // Display locked videos only to its owner
                        if(!dr["password"].ToString().Equals("LOCKED") || (dr["password"].ToString().Equals("LOCKED") && userId == myUserId))
                        {
                             videos.Add(new FetchVideoChannelRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["description"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["password"].ToString(),
                                        int.Parse(dr["views"].ToString()),
                                        int.Parse(dr["count"].ToString())
                                        ));
                        }

                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Check if user subscribed to another user
        public bool IsSubscribed(int userId, int subscribedTo)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);
                command.Parameters.AddWithValue("subscribedTo", subscribedTo);

                command.CommandText = "spIsSubscribed";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int count = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        count = int.Parse(dr["countRows"].ToString());
                    }
                }
                con.Close();
                return (count > 0);
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch channel details by userid
        public RespondChannel UserDetails(int userId, int myUserId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();
                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spUserDetails";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                RespondChannel channel = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        int subscribeState = 0; // [ 0 - hide ]||[ 1 - show ]||[ 2 - already subscribed ]
                        if (myUserId > 0 && userId != myUserId) {
                            subscribeState = 1;
                            if (IsSubscribed(myUserId, userId)) {
                                subscribeState = 2;
                            }
                        }

                        channel = new RespondChannel(int.Parse(dr["id"].ToString()),
                                        dr["username"].ToString(),
                                        "",
                                        dr["email"].ToString(),
                                        dr["picturePath"].ToString(),
                                        dr["registerDate"].ToString(),
                                        dr["about"].ToString(),
                                        int.Parse(dr["subscribers"].ToString()),
                                        subscribeState);
                    }
                }
                con.Close();
                return channel;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Suggested videos while typing in searchbar
        public List<FetchVideoRow> SuggestVideo(string query)
        {
            SqlConnection con = null;
            try
            {
                // Find video id's that matches the client's input
                HashSet<int> videoIdList = new HashSet<int>();
                string[] words = query.Split(' ');
                foreach (string word in words)
                {
                    videoIdList.UnionWith(VideoMatchWord(word, 0));
                }
                string videoIds = string.Join(",", videoIdList.ToArray().Select(x => x.ToString()).ToArray());

                con = Connect();
                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoIds", videoIds);
                command.Parameters.AddWithValue("offset", 0);
                command.Parameters.AddWithValue("next", 4);
                command.Parameters.AddWithValue("orderby", "");
                command.Parameters.AddWithValue("isDesc", 0);

                command.CommandText = "spSearchVideo";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoRow> videos = new List<FetchVideoRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["username"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["userId"].ToString()),
                                        int.Parse(dr["views"].ToString())));
                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Search video by keywords and filter options
        public RespondDataSearch<FetchVideoRow> SearchVideo(string query, int page, string[] orderby)
        {
            SqlConnection con = null;
            try
            {
                // Find video id's that matches the client's input
                HashSet<int> videoIdList = new HashSet<int>();
                string[] words = query.Split(' ');
                foreach (string word in words) {
                    videoIdList.UnionWith(VideoMatchWord(word, 0));
                }
                string videoIds = string.Join(",", videoIdList.ToArray().Select(x => x.ToString()).ToArray());

                con = Connect();
                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoIds", videoIds);
                command.Parameters.AddWithValue("offset", (page - 1) * PAGE_OFFSET);
                command.Parameters.AddWithValue("next", PAGE_OFFSET);
                command.Parameters.AddWithValue("orderby", orderby[0]);
                command.Parameters.AddWithValue("isDesc", orderby[1].Equals("desc") ? 1 : 0);

                command.CommandText = "spSearchVideo";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoRow> videos = new List<FetchVideoRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["username"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["userId"].ToString()),
                                        int.Parse(dr["views"].ToString())));
                    }
                }
                con.Close();
                return new RespondDataSearch<FetchVideoRow>(videos, videoIdList.Count);
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Find matching videos relating to given video
        public List<FetchVideoRow> AlsoLike(int videoId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);

                command.CommandText = "spVideoTitleById";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                string videoTitle = "";
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videoTitle = dr["title"].ToString();
                    }
                }

                HashSet<int> videoIdList = new HashSet<int>();
                string[] words = videoTitle.Split(' ');
                foreach(string word in words)
                {
                    videoIdList.UnionWith(VideoMatchWord(word, videoId));
                }

                con.Close();

                return FetchVideoRow("spAlsoLike", string.Join(",", videoIdList.ToArray().Select(x => x.ToString()).ToArray()));
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Find videos matching a word
        public HashSet<int> VideoMatchWord(string word, int ignoreId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("word", word);
                command.Parameters.AddWithValue("ignoreId", ignoreId);

                command.CommandText = "spVideoMatchWord";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                HashSet<int> videoIdList = new HashSet<int>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videoIdList.Add(int.Parse(dr["id"].ToString()));
                    }
                }

                con.Close();

                return videoIdList;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Adding comment to video, and returning it
        public FetchComment AddComment(int videoId, int userId, string content)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("content", content);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spAddComment";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                FetchComment newcomment = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        newcomment = new FetchComment(int.Parse(dr["id"].ToString()),
                                                      int.Parse(dr["userId"].ToString()),
                                                      int.Parse(dr["videoId"].ToString()),
                                                      dr["date"].ToString(),
                                                      dr["content"].ToString(),
                                                      dr["username"].ToString()
                                                      );
                    }
                }

                con.Close();

                return newcomment;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Count comments of video
        public int CountComments(int videoId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);

                command.CommandText = "spCountComments";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int count = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        count = int.Parse(dr["countRows"].ToString());
                    }
                }
                con.Close();
                return count;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch comments of video
        public List<FetchComment> FetchComments(int videoId, int page)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("offset", (page - 1) * COMMENT_PAGE_OFFSET);
                command.Parameters.AddWithValue("next", COMMENT_PAGE_OFFSET);

                command.CommandText = "spFetchComments";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchComment> comments = new List<FetchComment>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        comments.Add(new FetchComment(int.Parse(dr["id"].ToString()),
                                                      int.Parse(dr["userId"].ToString()),
                                                      int.Parse(dr["videoId"].ToString()),
                                                      dr["date"].ToString(),
                                                      dr["content"].ToString(),
                                                      dr["username"].ToString()
                                                        ));
                    }
                }
                con.Close();
                return comments;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Return array of all tagged user ids
        public Dictionary<string, int> TagMap(List<FetchComment> comments)
        {
            Dictionary<string,int> totalTags = new Dictionary<string, int>();
            foreach (FetchComment comment in comments)
            {
                string[] commentTags = Tags(comment.Content);
                foreach(string tag in commentTags)
                {
                    if(!totalTags.ContainsKey(tag))
                    {
                        int userId = SearchTag(tag);
                        if(userId > 0)
                             totalTags.Add(tag, SearchTag(tag));
                    }
                }
            }
            return totalTags;
        }

        // Return array of tags from comment (Hi @nati and @dor => [nati,dor])
        private string[] Tags(string content)
        {
            return content.Split(' ')
                          .Where(w => w.StartsWith("@"))
                          .Select(w => w.Replace("@", string.Empty))
                          .ToArray();
        }

        // Search user id by its username
        private int SearchTag(string username)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();
                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("username", username);

                command.CommandText = "spSearchTag";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int userId = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        userId = int.Parse(dr["id"].ToString());
                    }
                }
                con.Close();
                return userId;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Adding view to a video. If user logged in then with ip & userId, if not then only ip
        public void AddView(int videoId, int userId, string ip)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("ip", ip);
                if (userId > 0) {
                    command.Parameters.AddWithValue("userId", userId);
                }
                
                command.CommandText = "spAddView";

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception)
            {

            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Adding like to video if not liked yet, removing like if already liked
        public string Like(int videoId, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("userId", userId);

                string result = "";
                if(DidLike(videoId, userId) > 0) {
                    command.CommandText = "spRemoveLike";
                    result = "LIKEREMOVED"; // code for removed like
                } else {
                    command.CommandText = "spAddLike";
                    result = "LIKEADDED"; // code for added like
                }

                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return result;
            }
            catch (Exception)
            {
                return "ERROR";
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Check if user liked a video
        private int DidLike(int videoId, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);
                command.Parameters.AddWithValue("userId", userId);

                command.CommandText = "spDidLike";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                int result = 0;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        result = int.Parse(dr["totalRows"].ToString());
                    }
                }
                con.Close();
                return result;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }


        // Fetch video to watch
        public WatchVideo Watch(int videoId, string password, int userId)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("videoId", videoId);

                command.CommandText = "spWatch";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                WatchVideo video = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        // check if video is locked by password
                        if (dr["password"].ToString().Length > 0 && !dr["password"].ToString().Equals(password))
                        {
                            video = new WatchVideo("pw"); // code for incorrect password
                        }
                        else
                        {
                            video = new WatchVideo(int.Parse(dr["id"].ToString()),
                                                        dr["title"].ToString(),
                                                        dr["description"].ToString(),
                                                        dr["uploadDate"].ToString(),
                                                        int.Parse(dr["duration"].ToString()),
                                                        dr["videoPath"].ToString(),
                                                        dr["thumbnailPath"].ToString(),
                                                        int.Parse(dr["publisher"].ToString()),
                                                        dr["username"].ToString(),
                                                        int.Parse(dr["userId"].ToString()),
                                                        dr["picturePath"].ToString(),
                                                        int.Parse(dr["views"].ToString()),
                                                        int.Parse(dr["likes"].ToString()),
                                                        int.Parse(dr["subscribers"].ToString()),
                                                        DidLike(videoId, userId)
                                                    );
                        }

                    }
                }
                con.Close();
                return video;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Fetch trending videos [for trending page]
        public List<FetchVideoRow> FetchTrending()
        {
            return FetchVideoRow("spFetchTrending");
        }

        // Fetch popular videos [for main page]
        public List<FetchVideoRow> FetchPopular()
        {
            return FetchVideoRow("spFetchPopular");
        }

        // Fetch new videos [for main page]
        public List<FetchVideoRow> FetchNew()
        {
            return FetchVideoRow("spFetchNew");
        }

        // Fetch template for video rows
        private List<FetchVideoRow> FetchVideoRow(string commandtxt, string videoIds = null, int userId = 0)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                if(videoIds != null) {
                    command.Parameters.AddWithValue("videoIds", videoIds);
                }
                if (userId > 0) {
                    command.Parameters.AddWithValue("userId", userId);
                }

                command.CommandText = commandtxt;
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                List<FetchVideoRow> videos = new List<FetchVideoRow>();
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        videos.Add(new FetchVideoRow(int.Parse(dr["id"].ToString()),
                                        dr["title"].ToString(),
                                        dr["uploadDate"].ToString(),
                                        int.Parse(dr["duration"].ToString()),
                                        dr["videoPath"].ToString(),
                                        dr["thumbnailPath"].ToString(),
                                        int.Parse(dr["publisher"].ToString()),
                                        dr["username"].ToString(),
                                        dr["picturePath"].ToString(),
                                        int.Parse(dr["userId"].ToString()),
                                        int.Parse(dr["views"].ToString())));
                    }
                }
                con.Close();
                return videos;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Register new user
        public string Register(string username, string password, string email)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("username", username);
                command.Parameters.AddWithValue("password", password);
                command.Parameters.AddWithValue("email", email);

                command.CommandText = "spRegister";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                command.ExecuteNonQuery();
                con.Close();
                return "OK";
            }
            catch (Exception e)
            {
                if(e.Message.Contains("email_exists"))
                {
                    return "Email already exists";
                }else if(e.Message.Contains("user_exists"))
                {
                    return "Username already exists";
                }
                return "Unknown error, try again later";
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Login with username & password
        public User Login(string username, string password)
        {
            SqlConnection con = null;
            try
            {
                con = Connect();

                SqlCommand command = new SqlCommand();

                command.Parameters.AddWithValue("username", username);
                command.Parameters.AddWithValue("password", password);

                command.CommandText = "spLogin";
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 10; // in seconds

                User loggedUser = null;
                using (SqlDataReader dr = command.ExecuteReader(CommandBehavior.Default))
                {
                    while (dr.Read())
                    {
                        loggedUser = new User(int.Parse(dr["id"].ToString()),
                                        dr["username"].ToString(),
                                        dr["password"].ToString(),
                                        dr["email"].ToString(),
                                        dr["picturePath"].ToString(),
                                        dr["registerDate"].ToString(),
                                        dr["about"].ToString());
                    }
                }
                con.Close();
                return loggedUser;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private SqlConnection Connect()
        {


            // read the connection string from the web.config file
            string connectionString = WebConfigurationManager.ConnectionStrings["DBConnectionString"].ConnectionString;

            // create the connection to the db
            SqlConnection con = new SqlConnection(connectionString);

            // open the database connection
            con.Open();

            return con;

        }

    }
}