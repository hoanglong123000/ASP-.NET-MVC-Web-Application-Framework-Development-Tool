using Service.Education.Executes.Base;
using Service.Education.Executes.Clothesmn.Brands;
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
    public class BrandController : AuthController
    {
        #region CRUD Brand
        public ActionResult BrandList()
        {
            return View();
        }

        /*View Brand list.*/
        public JsonResult ViewBrandList(SearchBrandModel model, OptionResult option)
        {
            var result = _educationService.BrandMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult BrandOne(int id)
        {
            var result = _educationService.BrandOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /*Update Brand List*/
        public ActionResult BrandEdit(int? id)
        {
            var model = id.HasValue ? _educationService.BrandOne(id.Value) : new BrandViewModel()
            {

            };
            return PartialView("~/Views/" + _browser + "/Education/Partials/BrandEdit.cshtml", model);
        }

        [HttpPost]
        public JsonResult BrandEdit(BrandEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateBrand(model) : _educationService.EditBrand(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Delete Brand info.
        [HttpPost]
        public JsonResult DeleteBrandByIds(List<int> ids)
        {
            _educationService.DeleteBrandByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }


        #endregion
    }
}