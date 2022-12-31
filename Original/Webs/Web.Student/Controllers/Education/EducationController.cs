using System;
using System.Collections.Generic;
using System.Web.Mvc;
using  Web.Student.Controllers.Base; 
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Brands;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.SizeTabs;
using Service.Education.Executes.Clothesmn.TypeClothes;
using System.Linq;

//using

namespace Web.Student.Controllers.Edutcation
{
    public partial class EducationController : AuthController
    {
        #region Student GENERATE BY BUILDER

        public ActionResult Students()
        {
            return View();
        }

 
        public ActionResult StudentList(SearchStudentModel model, OptionResult option)
        {
            var result = _educationService.StudentMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult StudentOne(int id)
        {
            var result = _educationService.StudentOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult StudentEdit(int? id)
        {
            var model = id.HasValue ? _educationService.StudentOne(id.Value) : new StudentViewModel()
            {
                NgaySinh = DateTime.Now
            };
            return PartialView("~/Views/" + _browser + "/Education/Partials/StudentEdit.cshtml", model);
        }

        [HttpPost]
        public ActionResult StudentEdit(StudentEditModel model)
        {
            model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }
            var result = model.Id == 0 ? _educationService.CreateStudent(model) : _educationService.EditStudent(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DeleteStudentByIds(List<int> ids)
        {
            _educationService.DeleteStudentByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GroupList()
        {
            var list = new List<BaseItem>()
            {
                new BaseItem{Id = 1, Name = "Nhóm 1"},
                new BaseItem{Id = 2, Name = "Nhóm 2"},
                new BaseItem{Id = 3, Name = "Nhóm 3"}
            };
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        #endregion


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

        [HttpPost]
        public JsonResult DeleteBrandByIds(List<int> ids)
        {
            _educationService.DeleteBrandByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }


        #endregion



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
            using(var i = new ServerDBContext())
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