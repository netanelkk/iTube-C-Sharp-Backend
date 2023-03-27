using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondChannel : User
    {
        private int subscribers;
        private int subscribeState; // [ 0 - hide ]||[ 1 - show ]||[ 2 - already subscribed ]

        public RespondChannel(int id, string username, string password, string email, string picturePath, string registerDate, string about, int subscribers, int subscribeState)
            :base(id, username, password, email, picturePath, registerDate, about)
        {
            this.subscribers = subscribers;
            this.subscribeState = subscribeState;
        }

        public int SubscribeState { get => subscribeState; set => subscribeState = value; }
        public int Subscribers { get => subscribers; set => subscribers = value; }
    }
}