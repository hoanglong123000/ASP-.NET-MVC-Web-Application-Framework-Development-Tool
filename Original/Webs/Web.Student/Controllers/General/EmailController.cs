using  Web.Student.Controllers.Base;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.LocalEmailTemplates;
using Service.Core.Executes.Email;
using Service.Core.Executes.General.EmailTemplates;
using Service.Utility.Components;
using Service.Utility.Variables;
using System.Collections.Generic;
using System.Text;
using System.Web.Mvc;
//using

namespace Web.Student.Controllers.General
{
	public partial class GeneralController
	{

        public ActionResult Emails(string tab)
        {
            if (!tab.HasValue())
            {
                tab = "config";

			}
            ViewData["Tab"] = tab;
            return View();
        }

        public ActionResult EmailTaskList(SearchEmailTaskModel model, OptionResult option)
        {
            var result = _shareService.EmailTaskMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

		public ActionResult EmailTemplateList(SearchLocalEmailTemplateModel model, OptionResult option)
		{
			var result = _shareService.LocalEmailTemplateMany(model, option);
			return Json(result, JsonRequestBehavior.AllowGet);
		}

		public ActionResult EmailTaskDetailView(int id)
        {
            var model = _shareService.EmailTaskOne(id);

            var fp = FileComponent.GetFullPath(model.BodyPath);
            if (System.IO.File.Exists(fp))
            {
                model.Body = System.IO.File.ReadAllText(fp, Encoding.UTF8);
            }

            return PartialView("~/views/" + _version + "/" + _browser + "/Email/Partials/EmailTaskView.cshtml", model);
        }

        // GET: Email 
        public ActionResult GetSendEmailForm()
        {
            var model = new EmailModel();
            return PartialView("~/views/" + _version + "/" + _browser + "/Email/Partials/SendMailForm.cshtml", model);
        }

        [HttpPost]
        public ActionResult Send(EmailModel model)
        { 
            var result = _shareService.CreateEmailTaskWithBody(new LocalEmailTask()
            {
                Receivers = string.Join(";", model.Receivers),
                Module = model.ModuleCode,
                Subject = model.Subject,
                Attachs = model.Attachs != null ? string.Join(";", model.Attachs) : "",
                CC = model.Cc != null ? string.Join(";", model.Cc) : ""
            }, model.Body);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EmailTemplateView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/Email/Partials/EmailTemplateView.cshtml");
        }
		public ActionResult EmailTemplateDetailEdit(int id)
        {
			var model = _shareService.LocalEmailTemplateOne(id); 
			return PartialView("~/views/" + _browser + "/General/Partials/EmailTemplateDetailEdit.cshtml", model);
		}
		[HttpPost]
		public ActionResult EmailTemplateDetailEdit(LocalEmailTemplateEditModel model)
        {
			var result = _shareService.UpdateLocalEmailTemplateDetail(model);
			return Json(result, JsonRequestBehavior.AllowGet);
		}

		#region Test email

		public ActionResult TestEmailTemplate(int id)
        {
            var model = _shareService.LocalEmailTemplateOne(id);

            return PartialView("~/views/" + _version + "/" + _browser + "/Setting/Partials/Email_Test.cshtml", model);
        }
        [HttpPost]
        public ActionResult TestEmailTemplate(TestEmailTemplateModel model)
        {
            var et = new LocalEmailTask()
            {
                Subject = model.Subject, 
                Module = "Test",
                EmailType = "Test"
            };

            if (model.Receivers.HasValue())
            {
                et.Receivers = model.Receivers;
            }

            if (model.CCs.HasValue())
            {
                et.CC = model.CCs;
            }

            var body = model.BodyHtml;

            if(model.Attributes != null)
            {
                foreach(var a in model.Attributes)
                {
                    if(a.Attr == "##Link##")
                    {
                        body = body.Replace(a.Attr, a.Val.ToHtmlLink());
                    }
                    else
                    {
                        body = body.Replace(a.Attr, a.Val);
                    }
                }
            }

            var result = _shareService.CreateEmailTaskWithBody(et, body);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
        //Container
    }
}