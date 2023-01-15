using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.SizeTabs;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;
using Service.Education.Executes.Clothesmn.SoldCoupons;
using Service.Education.Executes.Clothesmn.DetailReceipts;
using NPOI.OpenXmlFormats.Dml.Diagram;





namespace Service.Education.Executes.Base
{
    public class SoldCouponController : AuthController
    {
        // GET: SoldCoupon
        public ActionResult SoldCouponList ()
        {
            return View();
        }

        public ActionResult SoldCouponOne(int id)
        {
            var result = _educationService.SoldCouponOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ViewSoldCouponList(SearchSoldCouponModel model, OptionResult option)
        {
            var result = _educationService.SoldCouponMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // UPDATE cloth.
        public ActionResult SoldCouponEdit(int? id)
        {
            var model = id.HasValue ? _educationService.SoldCouponOne(id.Value) : new SoldCouponViewModel();

            ViewData["StatusList"] = _shareService.OptionValueBaseList("SoldCouponStatus");
            ViewData["ShopTable"] = _shareService.OptionValueBaseList("OptionsShopTable");

            return PartialView("~/Views/" + _browser + "/Education/Partials/SoldCouponEdit.cshtml", model);
        }

        // Filtering the list of these coupons according to its status.
        public JsonResult SearchStatusList()
        {
            return Json(_shareService.OptionValueBaseList("SoldCouponStatus"), JsonRequestBehavior.AllowGet);
        }

        // Filtering the list of coupons according to its way to shop.(IsOnlineShop column).
        public JsonResult SearchMethodsToShopList()
        {
            return Json(_shareService.OptionValueBaseList("OptionsShopTable"), JsonRequestBehavior.AllowGet);
        }

       


        [HttpPost]
        public JsonResult SoldCouponEdit(SoldCouponEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            
            var result = model.Id == 0 ? _educationService.CreateSoldCoupon(model) : _educationService.EditSoldCoupon(model);
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

        /*public List<BaseItem> ClothAmountList(SearchClothModel ClothModel, OptionResult r)
        {
            var clothPList = _educationService.ClothMany(ClothModel, r);
            var list = clothPList.Many.ToList();
            
            return list;
        }*/

        // DELETE both SoldCoupon and its DetailReceipt.
        [HttpPost]
        public JsonResult DeleteSoldCouponByIds(List<int> ids)
        {
            _educationService.DeleteSoldCouponByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }

        // UPDATE Detail Receipt.
        public JsonResult DetailReceiptEdit(int id, SearchDetailReceiptModel model, OptionResult option)
        {
            var result = _educationService.DetailReceiptMany(id, model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // DELETE each rows of DetailReceipt.
        /*[HttpPost]*/
        /*    public JsonResult DeleteEachRowsOfReceipt(SoldCouponEditModel model)
            {
                model.UpdatedBy = _authData.EmployeeId;
                if (model.Id == 0)
                {
                    model.CreatedBy = _authData.EmployeeId;
                }
                var result = model.Id == 0 ? _educationService.EditSoldCoupon(model) : _educationService.DeleteEachReceiptRows(model);
                return Json(result, JsonRequestBehavior.AllowGet);
            }*/

        // Search Buyer.
        public JsonResult SearchBuyerName()
        {
            var list = new List<Customer>();
            using (var i = new ServerDBContext())
            {
                list = i.Customers.Where(x => x.Status >= 0).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}