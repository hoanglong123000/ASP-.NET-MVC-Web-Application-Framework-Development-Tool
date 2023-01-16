using Service.Education.Executes.Base;
using Service.Education.Executes.Clothesmn.Providers;
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
    public class ProviderController : AuthController
    {
        // GET: Provider
        public ActionResult ProviderList()
        {
            return View();
        }

        /*View Provider list.*/
        public JsonResult ViewProviderList(SearchProviderModel model, OptionResult option)
        {
            var result = _educationService.ProviderMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult ProviderOne(int id)
        {
            var result = _educationService.ProviderOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /*// Search SizeId.
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
        }*/

        // UPDATE Provider.
        public ActionResult ProviderEdit(int? id)
        {
            var model = id.HasValue ? _educationService.ProviderOne(id.Value) : new ProviderViewModel();

            /*ViewData["SizeList"] = _shareService.OptionValueBaseList("SizeTabs");*/

            return PartialView("~/Views/" + _browser + "/Education/Partials/ProviderEdit.cshtml", model);
        }



        [HttpPost]
        public JsonResult ProviderEdit(ProviderEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateProvider(model) : _educationService.EditProvider(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // DELETE Provider.
        [HttpPost]
        public JsonResult DeleteProviderByIds(List<int> ids)
        {
            _educationService.DeleteProviderByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }
    }
}