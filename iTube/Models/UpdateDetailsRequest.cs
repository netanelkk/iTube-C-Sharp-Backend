using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class UpdateDetailsRequest
    {
        private string email;
        private string newPassword;
        private string password;

        public UpdateDetailsRequest(string email, string newPassword, string password)
        {
            this.email = email;
            this.newPassword = newPassword;
            this.password = password;
        }

        public string Email { get => email; set => email = value; }
        public string NewPassword { get => newPassword; set => newPassword = value; }
        public string Password { get => password; set => password = value; }
    }
}