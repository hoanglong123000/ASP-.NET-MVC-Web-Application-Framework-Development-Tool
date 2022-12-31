using System.Web.Mvc;
using  Web.Student.Models; 
using Service.Core.Components;
using Service.Utility.Components;
namespace Web.Student.Controllers.Base
{
    public class BaseController : AppController
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            InitServices();
            _browser = RequestExtensions.IsMobileBrowser(HttpContext) ? "Wap" : "Web";
            _settings = _shareService.AppSettingMany(true);
            var path = Request.Path.ToLower();


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
            // disconnect services
            DisconectServices();
            Session["Browser"] = _browser;
            base.OnResultExecuting(filterContext);
        }

        public ActionResult GetPartialView(string module, string partialName)
        {
            return PartialView("~/Views/" + _browser + "/"+ module + "/partials/" + partialName + ".cshtml");
        }

        public ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }
        
    }
}