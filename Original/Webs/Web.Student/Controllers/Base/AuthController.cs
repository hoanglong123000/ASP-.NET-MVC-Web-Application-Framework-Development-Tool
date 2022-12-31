 
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using  Web.Student.Models; 
using Service.Core.Components;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Core.Executes.General.FeatureGroups;
using Service.Utility.Components;

namespace Web.Student.Controllers.Base
{
    public class AuthController : AppController
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            InitServices();
            _browser = RequestExtensions.IsMobileBrowser(HttpContext) ? "Wap" : "Web"; 
            var path = Request.Path.ToLower();
            if (path == "/")
            {
                path = "/home/index";
            }
            var bd = new BaseData
            {
                PathAndQuery = Request.Url != null ? Request.Url.PathAndQuery : "",
                Context = HttpContext,
                Settings = _settings,
                Browser = _browser ,
                LocalSettings = _localSettings
            };

            var au = new AuthComponent<EmployeeAuthViewModel>(HttpContext, _cookieName);
            var exceptionRole = System.IO.File.ReadAllLines(Server.MapPath("/app_data/exceptionRole.txt")).ToArray();
            var exceptionAuth = System.IO.File.ReadAllLines(Server.MapPath("/app_data/exceptionAuth.txt")).ToArray();
            
            if (au.Data != null)
            {
                bd.AuthData = au.Data;
                _educationService.Auth = au.Data;
                 
                //bd.IsAdmin = _educationService.EmployeeIsAdmin(au.Data.EmployeeId);
            }
            else
            {
                if (!exceptionAuth.Contains(path))
                {
                    filterContext.Result = Request.IsAjaxRequest() ?
                        new RedirectResult("/employee/sessionexpired") :
                        new RedirectResult("/employee/login?returnurl=" + Request.Url.PathAndQuery);
                }
            }
            _authData = au.Data;
            bd.AuthData = au.Data;

            _baseData = bd;
            ViewData["BaseData"] = bd;
          
            base.OnActionExecuting(filterContext);
        }

        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            // disconnect services
            DisconectServices();
            if (filterContext.Result is ViewResultBase viewResult)
            { 
                // Default the viewname to the action name
                if (String.IsNullOrEmpty(viewResult.ViewName))
                    viewResult.ViewName = filterContext.RouteData.GetRequiredString("action");

                var vn = viewResult.ViewName.ToLower();

                var excetionViews = new[] { "export", "exportcontent", "partials" };

                if (excetionViews.All(x => !vn.Contains(x)))
                {
                    // Add suffix according to device type

                    var r = Request.RequestContext.RouteData;

                    viewResult.ViewName = new StringBuilder().AppendFormat(
                        "~/Views/{0}/{1}/{2}.cshtml",
                         _browser, r.Values["controller"], r.Values["action"]).ToString();

                }
            }
            Session["Browser"] = _browser;
            base.OnResultExecuting(filterContext);
        }

        public AuthController()
        {
        }


        #region PHÊ DUYỆT CÁC CẤP

        

        #endregion

    }
}

