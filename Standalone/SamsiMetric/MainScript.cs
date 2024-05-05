using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading.Tasks;
using WebFramework;
using WebFramework.Backend;

namespace SamsiMetric
{
    public partial class MainScript : WebScript
    {

        public static MainScript Instance;

        public override async Task DOMContentLoaded()
        {
            Instance = this;
            Document.RunFunction("StartReact");
        }

    }
}
