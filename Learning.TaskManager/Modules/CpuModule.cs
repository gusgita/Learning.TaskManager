using Nancy;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Web;

namespace Learning.TaskManager
{
    public class CpuModule : NancyModule
    {
        PerformanceCounter cpuCounter;

        public CpuModule()
            :base("api/cpu")
        {
            InitializePerformanceCounter();
            Get["/"] = x =>
                {
                    int cpu = (int)Math.Ceiling(cpuCounter.NextValue());
                    return Response.AsText(cpu.ToString());
                };
        }

        private void InitializePerformanceCounter()
        {
            cpuCounter = new PerformanceCounter();
            cpuCounter.CategoryName = "Processor";
            cpuCounter.CounterName = "% Processor Time";
            cpuCounter.InstanceName = "_Total";
            cpuCounter.NextValue();
            Thread.Sleep(1000);
        }
    }
}