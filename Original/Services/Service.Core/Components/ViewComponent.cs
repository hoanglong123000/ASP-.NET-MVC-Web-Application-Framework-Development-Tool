using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Service.Core.Components;
using Service.Utility.Variables;

namespace Service.Core.Components
{
    public class ViewComponent
    {
        public HttpContextBase Context { get; set; }
        public AuthDataModel AuthData { get; set; }
        public string Project { get; set; }


        public ViewComponent(HttpContextBase context, AuthDataModel authData, string project)
        {
            Context = context;
            AuthData = authData;
            Project = project;
        }

        public void Hit()
        {
            new Task(Save).Start();
        }

        private void Save()
        {
            var exceptionViews = File.ReadAllLines(Context.Server.MapPath("/app_data/exceptionViews.txt"));
            var m = ConstantVariables.MediaConfigs.FirstOrDefault(x => !x.isFull);
            if (m != null)
            {
                if(!exceptionViews.Contains(Context.Request.Path.ToLower()))
                {
                    var path = "/media" + (m.id > 0 ? m.id + "" : "") + "/views_log";
                    path = FileComponent.DateFolder(path, null) + "/" + DateTime.Now.Hour + ".txt";
                    var fp = FileComponent.GetFullPath(path);
                    if (!File.Exists(fp))
                    {
                        File.Create(fp).Dispose();
                    }
                    var data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")
                               + "***" + Project
                               + "***" + GetIpAddress()
                               + "***" + AuthData.UserId + ":" + AuthData.FullName
                               + "***" + Context.Request.Path.ToLower()
                               + "***" + (Context.Request.IsAjaxRequest() ? "Ajax" : "Normal")
                               + "***" + Context.Request.HttpMethod
                               + "***" + Context.Request.UserAgent;
                    var done = false;
                    while (!done)
                    {
                        try
                        {
                            File.AppendAllText(fp, data + Environment.NewLine);
                            done = true;
                        }
                        catch (Exception)
                        {
                            Thread.Sleep(100);
                        }
                    }
                }
                
            }
        }
        protected string GetIpAddress()
        {
            if(Context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
            {
                string ipAddress = Context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (!string.IsNullOrEmpty(ipAddress))
                {
                    string[] addresses = ipAddress.Split(',');
                    if (addresses.Length != 0)
                    {
                        return addresses[0];
                    }
                }
                return Context.Request.ServerVariables["REMOTE_ADDR"];
            }
            return "";
        }
    }
}