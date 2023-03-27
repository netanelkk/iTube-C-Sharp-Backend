using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class About
    {
            private string about;
            public About(string about)
            {
                this.about = about;
            }

            public string GetAbout()
            {
                return (about == null) ? "" : about;
            }
    }
}