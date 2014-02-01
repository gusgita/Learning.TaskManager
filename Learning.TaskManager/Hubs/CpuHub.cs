using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Learning.TaskManager
{
    public class CpuHub : Hub
    {
        private readonly Broadcaster broadCaster;
        public CpuHub()
            : this(Broadcaster.Instance)
        {
        }

        public CpuHub(Broadcaster broadCaster)
        {
            this.broadCaster = broadCaster;
        }
    }
}