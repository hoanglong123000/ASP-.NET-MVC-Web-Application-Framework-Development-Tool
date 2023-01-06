using Service.Education.Executes.Base;
using Service.Education.Executes.Clothesmn.SizeTabs;
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
    public class SizeController : AuthController
    {
        #region CRUD Size of Clothes.
        public ActionResult SizeofList()
        {
            return View();
        }

        /*View Cloth list.*/
        public JsonResult ViewSizeofClothesList(SearchSizeTabModel model, OptionResult option)
        {
            var result = _educationService.SizeMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SizeOne(int id)
        {
            var result = _educationService.SizeOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SizeEdit(int? id)
        {
            var model = id.HasValue ? _educationService.SizeOne(id.Value) : new SizeTabViewModel();
            return PartialView("~/Views/" + _browser + "/Education/Partials/SizeEdit.cshtml", model);
        }

        [HttpPost]
        public JsonResult SizeEdit(SizeTabEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateSizeTab(model) : _educationService.EditSizeTab(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteSizeTabByIds(List<int> ids)
        {
            _educationService.DeleteSizeTabByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}