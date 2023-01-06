using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Web.Student.Controllers.Base;
using Service.Utility.Variables;
using DBServer.Entities;
using Service.Education.Executes.Clothesmn.TypeClothes;

namespace Web.Student.Controllers.Clothes
{
    public class TypeController : AuthController
    {
        public ActionResult TypeList()
        {
            return View();
        }

            
        public JsonResult ViewTypeofClothes(SearchTypeClotheModel model, OptionResult option)
        {
            var result = _educationService.TypeMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TypeOne(int id)
        {
            var result = _educationService.TypeOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult TypeEdit(int? id)
        {
            var model = id.HasValue ? _educationService.TypeOne(id.Value) : new TypeClotheViewModel()
            {

            };
            return PartialView("~/Views/" + _browser + "/Education/Partials/TypeEdit.cshtml", model);
        }

        [HttpPost]
        public JsonResult TypeEdit(TypeClotheEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateTypeClothe(model) : _educationService.EditTypeClothe(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteTypeClothesByIds(List<int> ids)
        {
            _educationService.DeleteTypeClothesByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }
    }
}