using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class UpdateTitleRequest
    {
        private string password;
        private bool privateChecked;

        public UpdateTitleRequest(string password, bool privateChecked)
        {
            this.password = password;
            this.privateChecked = privateChecked;
        }

        public string Password { get => password; set => password = value; }
        public bool PrivateChecked { get => privateChecked; set => privateChecked = value; }
    }
}