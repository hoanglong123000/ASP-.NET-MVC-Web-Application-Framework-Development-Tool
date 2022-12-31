using System;
using Service.Utility.Components; 
using Service.Core.Executes.General.Organizations;
using Service.Utility.Variables;
using System.Collections.Generic; 
using System.Web.Mvc; 
using Service.AuthSharing.Executes.General.LocalOrganizations;
//using
namespace Web.Student.Controllers.General
{
	public partial class GeneralController
	{
        #region CƠ CẤU TỔ CHỨC
        // GET: Organization
         
        public ActionResult Orgs()
        {   
            return View();
        }

        public ActionResult OrganizationList(SearchLocalOrganizationModel model, OptionResult option)
        {
            if (!_shareService.EmployeeIsAdmin(_authData.EmployeeId))
            {
                model.UserId = _authData.EmployeeId;
            }
            var result = _shareService.OrganizationViewMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
         
        [HttpPost]
        public ActionResult OrganizationEdit(LocalOrganizationEditModel model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId; 
            var result = _shareService.LocalOrganizationCommand(model);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult OrganizationEdit(int? id, int? parentId)
        {
            var model = new LocalOrganizationViewModel()
            {
                Code = "", 
                Type = 0
            };
            if (id.HasValue)
            {
                model = _shareService.LocalOrganizationOne(id.Value);
            }
            ViewData["KhuVuc"] = _shareService.OptionValueBaseList("KhuVuc");
            ViewData["LoaiBoPhan"] = _shareService.OptionValueBaseList("LoaiBoPhan");
            
            return PartialView("/Views/" + _version + "/" + _browser + "/General/Partials/OrganizationEdit.cshtml", model);
        } 

        [HttpPost]
        public ActionResult DeleteOrganizationByIds(List<int> ids)
        {
            _shareService.DeleteLocalOrganizationByIds(ids, _authData.EmployeeId);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //public ActionResult ChangePriorityOrganization(SearchOrganizationModel model)
        //{
        //    var result = _shareService.ChangePriorityOrganization(model);
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        #endregion
         
        //Container
    }
}