using Service.Core.Executes.General.FeatureGroups;
using Service.Utility.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;  

namespace Service.Education.Components
{

    public class AuthComponent<T>
    {
        public HttpContextBase Context { get; set; }
        public string CookieName { get; set; }
        public string Email { get; set; }
        public T Data
        {
            get
            {
                try
                {
                    var httpCookie = Context.Request.Cookies[CookieName];
                    if (httpCookie == null)
                        return (T)(object)null;
                    var ticket = FormsAuthentication.Decrypt(httpCookie.Value);
                    if (ticket == null)
                        return (T)(object)null;
                    var serializer = new JavaScriptSerializer();
                    return serializer.Deserialize<T>(ticket.UserData);
                }
                catch (Exception)
                {
                    return (T)(object)null;
                }
            }
        }
        public AuthComponent(HttpContextBase context, string cookieName )
        {
            Context = context;
            CookieName = cookieName;
        }


        public void UpdateCookie(T model, string email)
        {
            var serializer = new JavaScriptSerializer();
            var now = DateTime.Now;
            var ticket = new FormsAuthenticationTicket(0,
                email,
                now,
                now.AddHours(2),
                false,
                serializer.Serialize(model),
                FormsAuthentication.FormsCookiePath);

            string encrypt = FormsAuthentication.Encrypt(ticket);

            var cookie = new HttpCookie(CookieName, encrypt)
            {
                Domain = FormsAuthentication.CookieDomain,
                Path = FormsAuthentication.FormsCookiePath,
                HttpOnly = true,
                Secure = FormsAuthentication.RequireSSL,
                Expires = ticket.Expiration
            };

            Context.Response.Cookies.Add(cookie);
        }
        public void UpdateAuth(T user, string email)
        {
            SignOut();
            UpdateCookie(user, email);
        }
        public bool IsValidEmail(string email)
        {
            const string emailRegex = @"^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
            var re = new Regex(emailRegex);
            return re.IsMatch(email);
        }
        public void SignOut()
        {
            var httpCookie = Context.Request.Cookies[CookieName];
            if (httpCookie != null)
            {
                var c = new HttpCookie(CookieName)
                {
                    Expires = DateTime.Now.AddDays(-1)
                };
                Context.Response.Cookies.Add(c);
            }
        }
        public bool IsAllowAccess(List<FeatureGroupViewModel> features, string path)
        {
            if (!string.IsNullOrEmpty(path) && path.Contains("?"))
            {
                path = path.Substring(0, path.IndexOf("?", StringComparison.CurrentCulture));
            }

            if (path.Contains("portal"))
                return true;
            if (Context.Request.IsAjaxRequest())
                return true;
            foreach (var sb in features)
            {
                if (sb.Feature.ViewAction.HasValue())
                {
                    var va = sb.Feature.ViewAction.ToLower();
                    if (!string.IsNullOrEmpty(va) && va.Contains("&"))
                    {
                        va = va.Substring(0, va.IndexOf("&", StringComparison.CurrentCulture));
                    }
                    if (va == path)
                    {
                        if (sb.AllowView)
                            return true;
                    }
                }

                if (sb.Feature.RelateActions.HasValue())
                {
                    var lst = sb.Feature.RelateActions.Split(';').ToList();
                    if (lst.Contains(path))
                    {
                        if (sb.AllowView)
                            return true;
                    }
                }
            }
            return false;
        }
    }
}