using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Components;
using Service.Core.Executes.Base;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.SSO.Executes.Base;
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService : BaseService
    {
        public int Loop { get; set; }
        public string _encodeKey { get; set; }
        public int _dataMethod { get; set; } // 0: lấy dữ liệu local, 1: Lấy dữ liệu từ Core
        public AuthSharingContext Context { get; set; }
        public EmployeeAuthViewModel Auth { get; set; }
        public CoreService _coreService { get; set; }
        public SSOService _ssoService { get; set; }

        public HttpContextBase HttpContext { get; set; }

        public AuthSharingService(EmployeeAuthViewModel auth, HttpContextBase httpContext, int dataMethod)
        {
            Auth = auth;
            HttpContext = httpContext;
            Caching = new CachingComponent();
            _dataMethod = dataMethod;

            _coreService = new CoreService(httpContext);
            _ssoService = new SSOService(httpContext);
        }

        public AuthSharingService(HttpContextBase httpContext, int dataMethod)
        {
            HttpContext = httpContext;
            _dataMethod = dataMethod;
            Caching = new CachingComponent();

            _coreService = new CoreService(httpContext);
            _ssoService = new SSOService(httpContext);
        }

        public AuthSharingService()
        {
            Caching = new CachingComponent();

            _coreService = new CoreService();
            _ssoService = new SSOService();
        }

        public void CheckDbConnect()
        { 
            if (Context == null)
            {
                Loop = 1;
                Context = new AuthSharingContext();
            }
            else
            {
                Loop++;
                if (Loop == 100)
                {
                    Dispose();
                    Context = new AuthSharingContext();
                }
            }

            _coreService.CheckDbConnect();
            _ssoService.CheckDbConnect();
        }

        public void Dispose()
        {
            if (Context != null)
            {
                Context.Dispose();
                Context = null;
            }
            _coreService.Dispose();
            _ssoService.Dispose();
        }

        public void SaveContext<T>(T obj)
        {
            try
            {
                Context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                StringBuilder sb = new StringBuilder();
                foreach (var eve in e.EntityValidationErrors)
                {
                    sb.AppendLine(string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name,
                        eve.Entry.State));
                    foreach (var ve in eve.ValidationErrors)
                    {
                        sb.AppendLine(string.Format("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName,
                            ve.ErrorMessage));
                    }
                }
                throw new DbEntityValidationException(sb.ToString(), e);
            }
        }


        public T GetApiDataService<T>(string url, List<string> pars)
        {
            var settings = LocalSettingMany(true);    
            var domain = settings.GetValue("general", "domain_api");
            var link = domain + url;
            if (pars != null)
            {
                link += "?" + string.Join("&", pars);
            }

            try
            {
                var jsonStr = HtmlComponent.DownloadDataFromUrl(link, true);
                if (jsonStr.HasValue())
                {
                    var js = new JavaScriptSerializer();
                    var result = js.Deserialize<T>(jsonStr);
                    return result;
                }
            }
            catch (Exception e)
            {
                return default(T);
            }
            return default(T);
        }

        public T GetSsoDataService<T>(string url, List<string> pars, string token)
        {
            var settings = LocalSettingMany(true);
            var domain = settings.GetValue("general", "domain_sso");
            if (domain.HasValue())
            {
                var link = domain + url;
                if (pars != null)
                {
                    link += "?" + string.Join("&", pars);
                }

                try
                {
                    var done = false;
                    var sleep = 0;

                    using (var client = new WebClient())
                    {
                        client.Encoding = Encoding.UTF8;
                        client.Headers.Add("Authorization", "Bearer " + token);

                        var jsonStr = client.DownloadString(link);
                        if (jsonStr.HasValue())
                        {
                            var js = new JavaScriptSerializer();
                            var result = js.Deserialize<T>(jsonStr);
                            return result;
                        }

                        return default(T);
                    }
                }
                catch (Exception e)
                {
                    return default(T);
                }
            }
            return default(T);
        }

        public T PostApiDataService<T>(string url, string data)
        {
            var settings = LocalSettingMany(true);
            var domain = settings.GetValue("general", "domain_api");
            var link = domain + url;
            var jsonStr = HtmlComponent.PostDataToUrl(link, data);
            if (jsonStr.HasValue())
            {
                var js = new JavaScriptSerializer();
                var result = js.Deserialize<T>(jsonStr);
                return result;
            }

            return default(T);
        }

        public T PostSsoDataService<T>(string url, string data, string token)
        {
            var settings = LocalSettingMany(true);
            var domain = settings.GetValue("general", "domain_sso");
            if (domain.HasValue())
            {
                try
                { 
                    var link = domain + url; 
                    var http = (HttpWebRequest)WebRequest.Create(new Uri(link));
                    http.Accept = "application/json";
                    http.ContentType = "application/json";
                    http.Headers.Add("Authorization", "Bearer " + token);

                    http.Method = "POST";
                    ASCIIEncoding encoding = new ASCIIEncoding();
                    Byte[] bytes = encoding.GetBytes(data);

                    Stream newStream = http.GetRequestStream();
                    newStream.Write(bytes, 0, bytes.Length);
                    newStream.Close();

                    var response = http.GetResponse();

                    var stream = response.GetResponseStream();
                    var sr = new StreamReader(stream);
                    var jsonStr = sr.ReadToEnd();

                    if (jsonStr.HasValue())
                    {
                        var js = new JavaScriptSerializer();
                        var result = js.Deserialize<T>(jsonStr);
                        return result;
                    }

                    return default(T);
                }
                catch (Exception e)
                {
                    return default(T);
                } 
            }
            return default(T);
        }
    }
}