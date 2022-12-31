 
using Service.Core.Components;
using Service.Core.Executes.Employees.Employees;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web.Helpers;
using System.Web.Mvc;
using DBContext.Core.Entities;
using Web.Student.Controllers.Base;

//using

namespace Web.Student.Controllers.Employee
{
    public partial class EmployeeController : AuthController
    {
        // GET: User 

        public JsonResult EmployeeSuggestionList(SearchEmployeeModel model, OptionResult option)
        {
            var result = _shareService.EmployeeSuggestionList(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Container
    }
}