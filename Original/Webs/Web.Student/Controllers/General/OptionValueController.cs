using System.Collections.Generic;
using System.Web.Mvc;
using DBContext.Core.Entities; 
using Service.Core.Executes.General.OptionValues;
using Service.Utility.Variables;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.OptionValues;

namespace Web.Student.Controllers.General
{
	public partial class GeneralController
	{
        // GET: Developer
        public ActionResult OptionValues()
        {
            //ViewData["Countries"] = _shareService.CountryBaseList(80);
            return View();
        }

        public ActionResult OptionValueList(SearchOptionValueModel model, OptionResult option)
        {
            var result = _shareService.OptionValueMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult OptionValueEditAttr(int id, string attr, string value)
        {
            var result = _shareService.EditAttrOptionValue(id, attr, value);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult OptionValueEdit(int? id)
        {
            var opt  = _shareService.LocalOptionValueBaseList("LoaiDanhMuc");
            ViewData["ListLoaiDanhMuc"] = opt;
            var model = id.HasValue ? _shareService.OptionValueOne(id.Value) :
                new LocalOptionValue()
            {

            };
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/OptionValueEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult OptionValueEdit(LocalOptionValueEditModel model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;
           
            var result = _shareService.LocalOptionValueCommand(model);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeleteOptionValueByIds(List<int> ids)
        {
            _shareService.DeleteOptionValueByIds(ids);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ChangePriorityOptionValue(SearchOptionValueModel model)
        {
            //var result = _shareService.ChangePriorityOptionValue(model);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
    }
}