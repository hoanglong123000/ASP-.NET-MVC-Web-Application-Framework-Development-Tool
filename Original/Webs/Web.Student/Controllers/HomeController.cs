using CMS.Controllers.Base;
using DBServer.Entities;
using Service.Core.Executes.Base;
using Service.Education.Executes.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Web.Student.Controllers
{
    public class HomeController : AuthController
    {
        // GET: Homr
        public ActionResult Index()
        { 
            var sv = new EducationService();

            sv.CheckDbConnect();

            var a = sv.Context.EmployeeAuths.FirstOrDefault();
            a.PasswordHash = Crypto.HashPassword("admin");
            sv.Context.SaveChanges();
            sv.Dispose();

            return View();
        }

        public ActionResult Css()
        {
            return View();
        }

        public ActionResult GetItem()
        {
            var item = 1;
            return Json(item, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetHtmlContent()
        {
            return PartialView("~/Views/Web/Home/Partials/EditSp.cshtml");
        }
    }
}