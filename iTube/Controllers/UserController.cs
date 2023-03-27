using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using iTube.Models;

namespace iTube.Controllers
{
    public class UserController : ApiController
    {
        
        [HttpPost]
        [Route("api/auth/login")]
        // Login method with username & password
        public IHttpActionResult Login(User user)
        {
            User result = user.Login();
            if(result == null)
            {
                return BadRequest("Invalid username/password");
            }
            return Ok(new RespondToken(Models.User.Base64En(result.Id)));
        }

        [HttpPost]
        [Route("api/auth/register")]
        // Register of new user
        public IHttpActionResult Register(User user)
        {
            string usernameFormat = @"^[a-z0-9]+([_]{0,1}[a-z0-9]+)*$";
            string emailFormat = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$";

            if (!Regex.Match(user.Username, usernameFormat, RegexOptions.IgnoreCase).Success || user.Username.Length < 3 || user.Username.Length > 18) {
                return BadRequest("USERNAME"); // code for incorrect username
            }
            if (user.Password.Length < 6 || user.Password.Length > 18)
            {
                return BadRequest("PASSWORD");// code for incorrect password
            }
            if (!Regex.Match(user.Email, emailFormat, RegexOptions.IgnoreCase).Success)
            {
                return BadRequest("Email not valid");
            }

            string result = user.Register();
            if(result != "OK")
            {
                return BadRequest(result);
            }

            return Ok(new RespondMessage(result));
        }

    }
}
