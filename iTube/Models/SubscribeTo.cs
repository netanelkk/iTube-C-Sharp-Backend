using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class SubscribeTo
    {
        private int subscribeTo;

        public SubscribeTo(int subscribeTo)
        {
            this.subscribeTo = subscribeTo;
        }

        public int GetSubscribeTo()
        {
            return subscribeTo;
        }

    }
}