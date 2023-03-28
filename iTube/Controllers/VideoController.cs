using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using iTube.Models;
using Microsoft.AspNetCore.Http.Features;

namespace iTube.Controllers
{
    public class VideoController : ApiController
    {
        [HttpGet]
        [Route("api/main")]
        // Fetch new videos for main page
        public IHttpActionResult FetchNew()
        {
            List<FetchVideoRow> videos = Video.FetchNew();
            if (videos == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            return Ok(new RespondData<FetchVideoRow>(videos));
        }

        [HttpGet]
        [Route("api/main/popular")]
        // Fetch popular videos for main page
        public IHttpActionResult FetchPopular()
        {
            List<FetchVideoRow> videos = Video.FetchPopular();
            if (videos == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            return Ok(new RespondData<FetchVideoRow>(videos));
        }

        [HttpGet]
        [Route("api/main/trending")]
        // Fetch trending videos for trending page
        public IHttpActionResult FetchTrending()
        {
            List<FetchVideoRow> videos = Video.FetchTrending();
            if (videos == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            return Ok(new RespondData<FetchVideoRow>(videos));
        }

        [HttpGet]
        [Route("api/main/subscriptions")]
        // Fetch videos of my subscriptions [subscriptions page]
        public IHttpActionResult Subscriptions()
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                List<FetchVideoRow> subscriptionsVideos = Models.User.FetchSubscriptions(Models.User.Base64De(header.Parameter));
                if (subscriptionsVideos == null)
                    return BadRequest("Couldn't fetch videos");
                if (subscriptionsVideos.Count == 0)
                    return BadRequest("No videos were found");

                return Ok(new RespondData<FetchVideoRow>(subscriptionsVideos));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/main/history/{page}")]
        // Fetch viewed videos of user [history video page]
        public IHttpActionResult FetchHistory(int page)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                List<FetchVideoHistoryRow> historyVideos = Video.FetchHistory(userId, page);
                if (historyVideos == null)
                    return BadRequest("Couldn't fetch videos");
                if (historyVideos.Count == 0)
                    return BadRequest("No videos were found");

                return Ok(new RespondDataSearch<FetchVideoHistoryRow>(historyVideos, Video.CountHistory(userId)));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/main/likes/{page}")]
        // Fetch liked videos of user [liked video page]
        public IHttpActionResult FetchLikes(int page)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                List<FetchVideoRow> likedVideos = Video.FetchLikes(userId, page);
                if (likedVideos == null)
                    return BadRequest("Couldn't fetch videos");
                if (likedVideos.Count == 0)
                    return BadRequest("No videos were found");

                return Ok(new RespondDataSearch<FetchVideoRow>(likedVideos, Video.CountLikes(userId)));
            }
            return BadRequest("Request Error");
        }

        [HttpPost]
        [Route("api/watch/{videoId}")]
        // Watch video
        public IHttpActionResult Watch([FromBody] Password password, [FromUri] int videoId)
        {
            var header = Request.Headers.Authorization;
            string ipAddress = HttpContext.Current.Request.Headers["X-Forwarded-For"];
            if (ipAddress == null)
            {
                ipAddress = HttpContext.Current.Request.UserHostAddress;
            }
            string ip = ipAddress; 
            int userId = 0;
            if (header != null) { // user logged in
                userId = Models.User.Base64De(header.Parameter);
            }

            WatchVideo video = Video.Watch(videoId, (password==null) ? "" : password.GetPassword(), userId);
            if (video == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            if(video.Username.Equals("pw") && video.Id == 0)
            {
                return BadRequest("pw"); // password incorrect
            }

            // Adding view to video
            Video.AddView(videoId, userId, ip);

            return Ok(new RespondSingleData<WatchVideo>(video));
        }

        [HttpPost]
        [Route("api/watch/like")]
        // Add like to video
        public IHttpActionResult Like([FromBody] VideoId videoId)
        {
            var header = Request.Headers.Authorization;
            if(header != null)
            {
                string result = Video.Like((videoId == null) ? 0 : videoId.GetVideoId(), Models.User.Base64De(header.Parameter));
                if(result.Equals("ERROR"))
                {
                    return BadRequest("Try again later");
                }
                return Ok(new RespondMessage(result));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/watch/{videoId}/comments/{page}")]
        // Fetch comments of video [with pagination]
        public IHttpActionResult FetchComments(int videoId, int page)
        {
            List<FetchComment> comments = Comment.FetchComments(videoId, page);
            if (comments == null)
            {
                return BadRequest("Couldn't fetch comments");
            }

            return Ok(new RespondDataComments<FetchComment>(comments, Comment.CountComments(videoId), Comment.TagMap(comments)));
        }


        [HttpPost]
        [Route("api/watch/{videoId}/comments")]
        // Add comment to a video
        public IHttpActionResult AddComment([FromBody] Content content, [FromUri] int videoId)
        {
            var header = Request.Headers.Authorization;
            string commentText = (content == null) ? "" : content.GetContent();
            if(commentText.Length == 0)
            {
                return BadRequest("Comment is empty");
            }

            if (header != null)
            {
                FetchComment result = Comment.AddComment(videoId, Models.User.Base64De(header.Parameter), commentText);
                if (result == null)
                {
                    return BadRequest("Try again later");
                }
                return Ok(new RespondSingleDataComments<FetchComment>(result, Comment.TagMap(new List<FetchComment>() { result })));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/watch/{videoId}/alsolike")]
        // Fetch recommended videos for given video
        public IHttpActionResult AlsoLike(int videoId)
        {
            List<FetchVideoRow> videos = Video.AlsoLike(videoId);
            if (videos == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            return Ok(new RespondData<FetchVideoRow>(videos));
        }

        [HttpPut]
        [Route("api/watch/updatetitle/{videoId}")]
        // Update video title
        public IHttpActionResult UpdateDetails([FromBody] Title title, [FromUri] int videoId)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                if (!Video.UpdateTitle(videoId, userId, (title==null) ? "" : title.GetTitle()))
                {
                    return BadRequest("Update failed");
                }
                return Ok(new RespondMessage("UPDATED"));
            }
            return BadRequest("Request Error");
        }

        [HttpPut]
        [Route("api/watch/updateprivate/{videoId}")]
        // Updates video's visibily (private/public)
        public IHttpActionResult UpdatePrivate([FromBody] UpdateTitleRequest ut, [FromUri] int videoId)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                if(ut.PrivateChecked && ut.Password.Length == 0) { // don't change the current password
                    return Ok(new RespondMessage("NOTCHANGED"));
                }
                int userId = Models.User.Base64De(header.Parameter);
                if (!Video.UpdatePrivate(videoId, userId, ut.Password))
                {
                    return BadRequest("Update failed");
                }
                return Ok(new RespondMessage("UPDATED"));
            }
            return BadRequest("Request Error");
        }

        [HttpDelete]
        [Route("api/watch/delete/{videoId}")]
        // Delete video
        public IHttpActionResult DeleteVideo(int videoId)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                if (!Video.DeleteVideo(videoId, userId))
                {
                    return BadRequest("Delete failed");
                }
                return Ok(new RespondMessage("DELETED"));
            }
            return BadRequest("Request Error");
        }

        [HttpDelete]
        [Route("api/watch/commentdelete/{commentId}")]
        // Delete comment
        public IHttpActionResult DeleteComment(int commentId)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                if (!Comment.DeleteComment(commentId, userId))
                {
                    return BadRequest("Delete failed");
                }
                return Ok(new RespondMessage("DELETED"));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/watch/usersearch/{username}")]
        // Search username [used for tagging]
        public IHttpActionResult UserSearch(string username)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                List<User> users = Models.User.UserSearch(username, userId);
                if (users == null)
                {
                    return BadRequest("Couldn't fetch users");
                }
                return Ok(new RespondData<User>(users));
            }
            return BadRequest("Request Error");
        }

        [HttpPost]
        [Route("api/watch/upload")]
        // Update profile picture
        public IHttpActionResult Post()
        {
            string[] allowedExt = new string[] { ".mp4", ".webm" };

            var httpContext = HttpContext.Current;
            var header = Request.Headers.Authorization;

            // if request contains files and user is logged in
            if (httpContext.Request.Files.Count > 0 && header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                HttpPostedFile httpPostedFile = httpContext.Request.Files[0];
                string fileName = httpContext.Request.Form["fileName"];

                if (httpPostedFile != null)
                {
                    string extension = Path.GetExtension(fileName);
                    if (!allowedExt.Contains(extension))
                        return Content(HttpStatusCode.NotFound, "Only videos of mp4 or webm format are allowed");

                    // Generate unique names for video and thumbnail
                    string uniqueName = "video_" + Models.User.GenerateNamePath();
                    string videoPath = uniqueName + extension;

                    var fileSavePath = Path.Combine(HostingEnvironment.MapPath("~/" + Video.VIDEOS_PATH), videoPath);
                    httpPostedFile.SaveAs(fileSavePath); // saving the file

                    // Generating video thumbnail
                    Video.GenerateThumbnail(videoPath, uniqueName);

                    Video video = new Video(0, httpContext.Request.Form["title"],
                                               httpContext.Request.Form["description"],
                                               "",
                                               Convert.ToInt32(Video.CalculateDuration(videoPath)),
                                               videoPath,
                                               uniqueName+".jpg",
                                               userId,
                                               httpContext.Request.Form["password"]);

                    // Adding video to DB
                    int videoId = Video.AddVideo(video);
                    return Ok(new RespondNewVideo(videoId, uniqueName+".jpg"));
                }
                return BadRequest("Try again later");
            }

            return BadRequest("Request Error");
        }
    }
}
