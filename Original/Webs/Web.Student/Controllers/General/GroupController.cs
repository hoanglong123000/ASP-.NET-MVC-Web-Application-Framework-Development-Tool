using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Service.AuthSharing.Executes.General.Groups; 
using Service.Core.Executes.General.FeatureGroups;
using Service.Core.Executes.General.Features;
using Service.Core.Executes.General.Groups;
using Service.Core.Executes.General.OptionValues;
using Service.Utility.Variables;

namespace Web.Student.Controllers.General
{
	public partial class GeneralController
	{
        #region Group

        public ActionResult Groups()
        {
            return View();
        }
        public ActionResult GroupView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/GroupView.cshtml");
        }
        public ActionResult GroupList(SearchGroupModel model, OptionResult option)
        {
            var result = _shareService.GroupMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GroupEdit(int? id)
        {
            var model = new GroupViewModel()
            {
                FeatureGroups = new List<FeatureGroupViewModel>()
            };
            if (id.HasValue)
            {
                model = _shareService.GroupOne(id.Value);
            } 
            var features = _shareService.FeatureMany(new SearchFeatureModel() { }, new OptionResult()
            {
                Unlimited = true
            });

            ViewData["Features"] = features.Many;

            ViewData["ListPhanHe"]  = _shareService.OptionValueMany(new SearchOptionValueModel()
            {
                Type = "PhanHe",
                Cache = true
            }, new OptionResult() {Unlimited = true}).Many;

            return PartialView("~/views/" + _version + "/" + _browser + "/General/partials/GroupEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult GroupEdit(LocalGroupEditModel model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;
            var sb = model.Id == 0 ? _shareService.CreateGroup(model) : _shareService.EditGroup(model);
            return Json(sb, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeleteGroupByIds(List<int> ids)
        {
            foreach (var id in ids)
            {
                _shareService.DeleteGroup(id);
            }
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}