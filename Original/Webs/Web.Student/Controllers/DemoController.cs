using  Web.Student.Models;
using Service.Core.Executes.Base;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProjectContract.Controllers
{
    public class DemoController : Controller
    {
        // GET: Demo
        public ActionResult Feedbacks()
        { 
            return View();
        }

        // Get
        public ActionResult FeedbackList(SearchFeedbackModel model, OptionResult option)
        {
            var result = _coreService.FeedbackMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        } 
        public ActionResult FeedbackOne(int id)
        {
            var result = _coreService.FeedbackOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // them + sua
        // GET 
        public ActionResult FeedbackEdit(int? id)
        {
            // nếu id != null ? sửa , ngược lại thêm
            var model = id.HasValue ? _coreService.FeedbackOne(id.Value) : new FeedbackViewModel()
            {
            };

            return View();
        }

        // POST
        [HttpPost]
        public ActionResult FeedbackEdit(FeedbackEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _coreService.CreateFeedback(model) : _coreService.EditFeedback(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DeleteFeedbackByIds(List<int> ids)
        {
            _coreService.DeleteFeedbackByIds(ids, _authData.EmployeeId);
            return Json(true, JsonRequestBehavior.AllowGet);
        }


        // Feedback
        public JsonResult GetFeedbackList(SearchFeedbackModel model, OptionResult option)
        {
            var danhsach = _coreService.FeedbackMany(model, option);


            ///
            return Json(danhsach, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FormThemSanPham()
        {
            return PartialView("~/Views/2.0/Web/Test/Partials/DoanCodeThemHocSinh.cshtml");
        }

        [HttpPost]
        public ActionResult TaoTenHocSinh(string tenHS)
        {

            // luu xuong db

            return Json(true, JsonRequestBehavior.AllowGet);
        }
    }
}