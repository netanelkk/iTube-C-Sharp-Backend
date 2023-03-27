using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using iTube.Models;

namespace iTube.Controllers
{
    public class ChannelController : ApiController
    {

        [HttpGet]
        [Route("api/channel/mysubscriptions/{page}")]
        // My Subscription list
        public IHttpActionResult Subscriptions(int page)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                List<RespondSubscriptions> subscriptions = Models.User.Subscriptions(Models.User.Base64De(header.Parameter), page);
                if (subscriptions == null)
                    return BadRequest("Couldn't fetch subscription list");
                if (subscriptions.Count == 0)
                    return BadRequest("No subscriptions were found");

                return Ok(new RespondData<RespondSubscriptions>(subscriptions));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/channel/uploaded/{userId}/{page}")]
        // Uploaded videos of channel
        public IHttpActionResult ChannelUploadedVideos(int userId, int page)
        {
            var header = Request.Headers.Authorization;
            int myUserId = 0;
            if (header != null)
            { // user logged in
                myUserId = Models.User.Base64De(header.Parameter);
            }
            List<FetchVideoChannelRow> channelVideos = Models.User.ChannelUploadedVideos(userId, page, myUserId);
            if (channelVideos == null)
                return BadRequest("Couldn't fetch videos");
            if (channelVideos.Count == 0)
                return BadRequest("No videos were found");

            return Ok(new RespondData<FetchVideoChannelRow>(channelVideos));
        }

        [HttpPost]
        [Route("api/channel/subscribe")]
        // Subscribe to channel
        public IHttpActionResult Subscribe([FromBody] SubscribeTo subscribeTo)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                if (!Models.User.Subscribe(Models.User.Base64De(header.Parameter), subscribeTo.GetSubscribeTo()))
                {
                    return BadRequest("Try again later");
                }
                return Ok(new RespondMessage("Subscribed"));
            }
            return BadRequest("Request Error");
        }

        [HttpPost]
        [Route("api/channel/unsubscribe")]
        // Unsubscribe from channel
        public IHttpActionResult Unsubscribe([FromBody] SubscribeTo subscribeTo)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                if (!Models.User.Unsubscribe(Models.User.Base64De(header.Parameter), subscribeTo.GetSubscribeTo()))
                {
                    return BadRequest("Try again later");
                }
                return Ok(new RespondMessage("Unsubscribed"));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/channel/mydetails")]
        // Fetch my user details
        public IHttpActionResult MyDetails()
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                RespondChannel mydetails = Models.User.MyDetails(Models.User.Base64De(header.Parameter));
                if (mydetails == null)
                {
                    return BadRequest("Try again later");
                }
                return Ok(new RespondSingleData<RespondChannel>(mydetails));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/channel/{userId}")]
        // Fetch channel details by userid
        public IHttpActionResult UserDetails(int userId)
        {
            var header = Request.Headers.Authorization;
            int myUserId = 0;
            if (header != null) { // user logged in
                myUserId = Models.User.Base64De(header.Parameter);
            }
            RespondChannel channel = Models.User.UserDetails(userId, myUserId);
            if (channel == null)
            {
                return BadRequest("Couldn't fetch channel");
            }
            return Ok(new RespondSingleData<RespondChannel>(channel));
        }

        [HttpPost]
        [Route("api/channel/details")]
        // Update user's details
        public IHttpActionResult UpdateDetails(UpdateDetailsRequest ud)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                if (Models.User.UpdateDetails(ud.Email, ud.NewPassword, ud.Password, userId) == 0) // 0 rows updated
                {
                    return BadRequest("Current password incorrect");
                }
                return Ok(new RespondMessage("UPDATED"));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/channel/liked/{userId}/{page}")]
        // Fetch liked videos of channel
        public IHttpActionResult ChannelLiked(int userId, int page)
        {
            var header = Request.Headers.Authorization;
            int myUserId = 0;
            if (header != null) { // user logged in
                myUserId = Models.User.Base64De(header.Parameter);
            }
            List<FetchVideoLikedRow> videos = Models.User.ChannelLiked(userId, (userId == myUserId ? 1 : 0), page);
            if (videos == null)
                return BadRequest("Couldn't fetch channel");
            if (videos.Count == 0)
                return BadRequest("No videos were found");
            return Ok(new RespondData<FetchVideoLikedRow>(videos));
        }

        [HttpGet]
        [Route("api/channel/subscriptions/{userId}/{page}")]
        // Subscription list of {userId}
        public IHttpActionResult Subscriptions(int userId, int page)
        {
            List<RespondSubscriptions> subscriptions = Models.User.Subscriptions(userId, page);
            if (subscriptions == null)
                return BadRequest("Couldn't fetch subscription list");
            if (subscriptions.Count == 0)
                return BadRequest("No subscriptions were found");

            return Ok(new RespondData<RespondSubscriptions>(subscriptions));
        }

        [HttpPost]
        [Route("api/channel/updateprofile")]
        // Update profile details
        public IHttpActionResult UpdateProfile(About about)
        {
            var header = Request.Headers.Authorization;
            if (header != null)
            {
                int userId = Models.User.Base64De(header.Parameter);
                if (!Models.User.UpdateProfile(about.GetAbout(), userId))
                {
                    return BadRequest("Update failed");
                }
                return Ok(new RespondMessage("UPDATED"));
            }
            return BadRequest("Request Error");
        }

        [HttpGet]
        [Route("api/channel/totalviews/{userId}")]
        // Count total views of a channel 6 months ago
        public IHttpActionResult TotalViews(int userId)
        {
            TotalViews totalViews = Models.User.TotalViews(userId);
            if (totalViews == null)
            {
                return BadRequest("Try again later");
            }
            return Ok(new RespondSingleData<TotalViews>(totalViews));
        }

        [HttpPost]
        [Route("api/channel/picture")]
        // Update profile picture
        public IHttpActionResult Picture()
        {
            string newPath = "Content/user_thumbnails";
            string[] allowedExt = new string[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

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
                        return Content(HttpStatusCode.NotFound, "Only images are allowed");

                    string picturePath = "profile_" + Models.User.GenerateNamePath() + extension;

                    try {
                        var fileSavePath = Path.Combine(HostingEnvironment.MapPath("~/" + newPath), picturePath);
                        httpPostedFile.SaveAs(fileSavePath); // saving the file
                    } catch {

                    }

                    string oldPicturePath = Models.User.UpdatePicture(picturePath, userId);
                    if (oldPicturePath != null)
                    {
                        File.Delete(Path.Combine(HostingEnvironment.MapPath("~/" + newPath), oldPicturePath)); // deleting the old one
                        return Ok(picturePath);
                    }
                }
                return BadRequest("Try again later");
            }

            return BadRequest("Request Error");
        }


    }
}
