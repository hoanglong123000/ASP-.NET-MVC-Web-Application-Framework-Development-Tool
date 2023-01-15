using Service.Education.Executes.Clothesmn.ImportedCoupons;
using Service.Education.Executes.Clothesmn.SoldCoupons;
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
            /* if (result.Data.Status == 1) {
                 //xu ly trong kho
                 var list = model.detailReceipts.Where(x => x.Status == 0).ToList();
                 var listId = list.Select(x => x.Id).ToList();
                 var A = new SearchClothModel();
                 var r = new OptionResult();
                 var listMau = ClothAmountList(A, r);


             }*/

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}