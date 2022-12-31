using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Mvc;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using DBServer.Entities;
using Service.AuthSharing.Executes.Base;
using Service.Core.Executes.Base;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Education.Executes.Base;
using Service.Utility.Components;
using Web.Student.Models;

namespace Web.Student.Controllers.Base
{
    public class AppController : Controller
    {
        public string _browser { get; set; }
        public EducationService _educationService { get; set; }
		public AuthSharingService _shareService { get; set; }
		public CoreService _coreService { get; set; }
		public EmployeeAuthViewModel _authData { get; set; }
        public string _encodeKey { get; set; }
        public string _cookieName { get; set; }
		public string _loginMethod { get; set; }
        public string _cookieDomain { get; set; }
        public int _dataMethod { get; set; }
		public BaseData _baseData { get; set; }
		public List<AppSetting> _settings { get; set; }
		public List<LocalSetting> _localSettings { get; set; }

		public string _version { get; set; }
        
        public void InitServices()
        {
			_dataMethod = Int32.Parse(ConfigurationManager.AppSettings["DataMethod"].ToString());
			_encodeKey = ConfigurationManager.AppSettings["EncodeSecret"];
			_cookieName = ConfigurationManager.AppSettings["CookieName"];
			_cookieDomain = ConfigurationManager.AppSettings["CookieDomain"];
			_loginMethod = ConfigurationManager.AppSettings["LoginMethod"];

			if (_shareService == null)
			{
				_shareService = new AuthSharingService(null, HttpContext, _dataMethod);
				_shareService._encodeKey = _encodeKey;
			}

			//_settings = _shareService.AppSettingMany(true);
			_localSettings = _shareService.LocalSettingMany(true);

			if (_educationService == null)
            { 
                _educationService = new EducationService( HttpContext, _dataMethod); 
            }
        }
        public void InitServices(EmployeeAuthViewModel auth)
        {
            if (_educationService == null)
            { 
                _educationService = new EducationService(auth, HttpContext, _dataMethod); 
            }
        }
        public void DisconectServices()
        {
            _educationService.Dispose(); 
            _educationService = null;
        }

        public string RenderPartialToString(string controlName, object model)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, controlName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View,
                                             ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
        public string SaveGuidImage(HttpPostedFileBase file, string type, Guid id)
        {
            var path = "/media/"+ type + "/" + id.ToString()[0];

            var fp = FileComponent.GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + id + ".jpg";
            fp = FileComponent.GetFullPath(path);
            if (System.IO.File.Exists(fp))
            {
                System.IO.File.Delete(fp);
            }
            file.SaveAs(fp);
            return path;
        }
        public string SaveImage(HttpPostedFileBase file, string type)
        {
            var ext = Path.GetExtension(file.FileName);
            var path = "/media/" + type + "/";
            path = FileComponent.DateFolder(path, null) + "/" + Guid.NewGuid() + ext;

            var fp = FileComponent.GetFullPath(path); 

            if (System.IO.File.Exists(fp))
            {
                System.IO.File.Delete(fp);
            }
            file.SaveAs(fp);
            return path;
        }
        public ActionResult ImageCropperView()
        {
            return PartialView("~/Views/Web/Shared/ImageCropperView.cshtml");
        }

        public string SaveFileUpload(HttpPostedFileBase file, string type)
        {
            var ext = Path.GetExtension(file.FileName);
            var path = "/media/" + type + "/";
            path = FileComponent.DateFolder(path, null) + "/" + Guid.NewGuid() + ext;

            var fp = FileComponent.GetFullPath(path);

            if (System.IO.File.Exists(fp))
            {
                System.IO.File.Delete(fp);
            }
            file.SaveAs(fp);
            return path;
        }
    }
}