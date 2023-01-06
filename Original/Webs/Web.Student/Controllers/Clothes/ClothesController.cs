using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;

namespace Web.Student.Controllers.Clothes
{
    public class ClothesController : AuthController
    {
        #region CRUD Clothes
        public ActionResult ClothList()
        {
            return View();
        }

        /*View Cloth list.*/
        public JsonResult ViewClothList(SearchClothModel model, OptionResult option)
        {
            var result = _educationService.ClothMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult ClothOne(int id)
        {
            var result = _educationService.ClothOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Search SizeId.
        public JsonResult SizeClothesList()
        {
            var list = _shareService.OptionValueBaseList("SizeTabs");
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // Search BrandId.
        public JsonResult SearchBrandList()
        {
            var list = new List<Brand>();
            using (var i = new ServerDBContext())
            {
                list = i.Brands.Where(x => x.Status >= 0).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // UPDATE cloth.
        public ActionResult ClothEdit(int? id)
        {
            var model = id.HasValue ? _educationService.ClothOne(id.Value) : new ClothViewModel();

            ViewData["SizeList"] = _shareService.OptionValueBaseList("SizeTabs");

            return PartialView("~/Views/" + _browser + "/Education/Partials/ClothEdit.cshtml", model);
        }



        [HttpPost]
        public JsonResult ClothEdit(ClothEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateCloth(model) : _educationService.EditCloth(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // DELETE Cloth
        [HttpPost]
        public JsonResult DeleteClothByIds(List<int> ids)
        {
            _educationService.DeleteClothByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }


        #endregion
    }
}