using DBServer.Entities;
using Service.Education.Executes.Clothesmn.DetailReceipts;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;
using Service.Education.Executes.Clothesmn.SoldCoupons;

namespace Web.Student.Controllers.Clothes
{
    public class DetailReceiptController : AuthController
    {
        // GET: DetailReceipt
        public ActionResult DetailReceiptList()
        {
            return View();
        }

        /*View Detail Receipt list.*/
        /*public JsonResult ViewDetailReceiptList(SearchDetailReceiptModel model, OptionResult option)
        {
            var result = _educationService.DetailReceiptMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }*/


        public ActionResult DetailReceiptOne(int id)
        {
            var result = _educationService.DetailReceiptOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Search SizeId.
       /* public JsonResult SizeDetailReceiptList()
        {
            var list = _shareService.OptionValueBaseList("SizeTabs");
            return Json(list, JsonRequestBehavior.AllowGet);
        }*/

        // Search BrandId.
        /*public JsonResult SearchBrandList()
        {
            var list = new List<Brand>();
            using (var i = new ServerDBContext())
            {
                list = i.Brands.Where(x => x.Status >= 0).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }*/

        



        /*[HttpPost]
        public JsonResult DetailReceiptEdit(DetailReceiptEditModel model)
        {
            *//*model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }*//*
            var result = model.Id == 0 ? _educationService.CreateDetailReceipt(model) : _educationService.EditDetailReceipt(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }*/

        
    }
}