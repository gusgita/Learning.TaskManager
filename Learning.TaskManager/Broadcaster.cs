using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Web;

namespace Learning.TaskManager
{
    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> instance = new Lazy<Broadcaster>(
            () => new Broadcaster(GlobalHost.ConnectionManager.GetHubContext<CpuHub>().Clients));

        private readonly TimeSpan updateInterval = TimeSpan.FromMilliseconds(1000);
        private readonly Timer timer;

        public static Broadcaster Instance
        {
            get { return instance.Value; }

        }

        private IHubConnectionContext Clients
        {
            get;
            set;
        }

        private Broadcaster(IHubConnectionContext clients)
        {
            Clients = clients;
            timer = new Timer(BroadcastCpuUsage, null, updateInterval, updateInterval);
        }

        private void BroadcastCpuUsage(object state){
            string cpu = GetCurrentCpu();
            Clients.All.cpuInfo(Environment.MachineName,cpu);
        }

        private string GetCurrentCpu()
        {
            string currentCpu = "0";
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:8081");

            var response = client.GetAsync("api/cpu").Result;
            if (response.IsSuccessStatusCode)
            {
                currentCpu = response.Content.ReadAsStringAsync().Result;
            }
            return currentCpu;
        }
    }
}