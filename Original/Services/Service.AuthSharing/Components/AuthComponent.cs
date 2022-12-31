using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security; 

namespace Service.AuthSharing.Components
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
        public AuthComponent(HttpContextBase context, string cookieName)
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
                DateTime.Now,
                DateTime.Now.AddDays(1),
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
                Expires = DateTime.Now.AddDays(1)
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
    }
}