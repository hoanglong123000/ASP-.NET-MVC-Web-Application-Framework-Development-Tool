using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.DetailReceipts;
using Service.Education.Executes.Clothesmn.ImportedCoupons;
using Service.Education.Executes.Clothesmn.SoldCoupons;
using Service.Education.Executes.Clothesmn.DetailImportedReceipts;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;


namespace Web.Student.Controllers.Clothes
{
    public class ImportedCouponController : AuthController
    {
        // GET: ImportedCoupon
        public ActionResult ImportedCouponList()
        {
            return View();
        }

        public ActionResult ImportedCouponOne(int id)
        {
            var result = _educationService.ImportedCouponOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ViewImportedCouponList(SearchImportedCouponModel model, OptionResult option)
        {
            var result = _educationService.ImportedCouponMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // UPDATE Imported Coupon.
        public ActionResult ImportedCouponEdit(int? id)
        {
            var model = id.HasValue ? _educationService.ImportedCouponOne(id.Value) : new ImportedCouponViewModel();
            ViewData["StatusImportedList"] = _shareService.OptionValueBaseList("ImportedStatusTab");
       


            return PartialView("~/Views/" + _browser + "/Education/Partials/ImportedCouponEdit.cshtml", model);
        }


        [HttpPost]
        public JsonResult ImportedCouponEdit(ImportedCouponEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }

            var result = model.Id == 0 ? _educationService.CreateImportedCoupon(model) : _educationService.EditImportedCoupon(model);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteImportedCouponByIds(List<int> ids)
        {
            _educationService.DeleteImportedCouponByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }

        // Search Provider Name.
        public JsonResult SearchProviderNameList()
        {
            var list = new List<Provider>();
            using (var i = new ServerDBContext())
            {
                list = i.Providers.Where(x => x.Status >= 0).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // Filtering the list of these coupons according to its status.
        public JsonResult SearchStatusList()
        {
            return Json(_shareService.OptionValueBaseList("ImportedStatusTab"), JsonRequestBehavior.AllowGet);
        }


        public JsonResult DetailImportedReceiptEdit(int id, SearchDetailImportedReceiptModel model, OptionResult option)
        {
            var result = _educationService.DetailImportedReceiptMany(id, model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}