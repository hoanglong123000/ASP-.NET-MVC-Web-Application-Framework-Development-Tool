using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.Customers;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;

namespace Web.Student.Controllers.Clothes
{
    public class CustomerController : AuthController
    {
        // GET: Customer
        public ActionResult CustomerList()
        {
            return View();
        }

        /*View Customer list.*/
        public JsonResult ViewCustomerList(SearchCustomerModel model, OptionResult option)
        {
            var result = _educationService.CustomerMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult CustomerOne(int id)
        {
            var result = _educationService.CustomerOne(id);
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

        // UPDATE cloth.
        public ActionResult CustomerEdit(int? id)
        {
            var model = id.HasValue ? _educationService.CustomerOne(id.Value) : new CustomerViewModel();

            /*ViewData["SizeList"] = _shareService.OptionValueBaseList("SizeTabs");*/

            return PartialView("~/Views/" + _browser + "/Education/Partials/CustomerEdit.cshtml", model);
        }



        [HttpPost]
        public JsonResult CustomerEdit(CustomerEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateCustomer(model) : _educationService.EditCustomer(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // DELETE Cloth
        [HttpPost]
        public JsonResult DeleteCustomerByIds(List<int> ids)
        {
            _educationService.DeleteCustomerByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }
    }
}