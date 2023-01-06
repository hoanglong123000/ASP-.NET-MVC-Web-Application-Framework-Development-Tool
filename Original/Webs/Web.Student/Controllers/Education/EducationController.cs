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


        



        

       


    }
}