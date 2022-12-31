using System;
using System.Text;
using System.Web.Mvc;
using  Web.Student.Models; 
using Service.Core.Components;
using Service.Utility.Components; 
namespace Web.Student.Controllers.Base
{
    public class NoneAuthController : AppController
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            InitServices();
            _browser = RequestExtensions.IsMobileBrowser(HttpContext) ? "Wap" : "Web";
            _settings = _shareService.AppSettingMany(true);
            var bd = new BaseData
            {
                PathAndQuery = Request.Url.PathAndQuery,
                Context = HttpContext,
                Settings = _settings,
                Browser = _browser
            };

            _baseData = bd;
            ViewData["BaseData"] = bd;
            base.OnActionExecuting(filterContext);
        }

        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            DisconectServices();
            if (filterContext.Result is ViewResultBase viewResult)
            {
                if (String.IsNullOrEmpty(viewResult.ViewName))
                    viewResult.ViewName = filterContext.RouteData.GetRequiredString("action");
                var r = Request.RequestContext.RouteData;
                viewResult.ViewName = new StringBuilder().AppendFormat(
                    "~/Views/{0}/{1}/{2}.cshtml",
                    _browser, r.Values["controller"], r.Values["action"]).ToString();
            }
            Session["Browser"] = _browser;
            base.OnResultExecuting(filterContext);
        }
      
    }
}