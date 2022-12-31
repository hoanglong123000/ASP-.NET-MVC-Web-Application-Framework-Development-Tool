using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Mvc;
using  Web.Student.Controllers.Base;
using DBContext.AuthSharing.Entities; 
using Service.AuthSharing.Executes.Employees.Employees;
using Service.AuthSharing.Executes.General.JobPositions;
using Service.AuthSharing.Executes.General.JobTitles;
using Service.AuthSharing.Executes.General.LocalSettings; 
using Service.Core.Executes.Category.JobPositions;
using Service.Core.Executes.Employees.Employees; 
using Service.Core.Executes.General.Groups;
using Service.Core.Executes.General.JobTitles; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Core.Executes.General.Address;
//using
namespace Web.Student.Controllers.General
{
	public partial class GeneralController : AuthController
    {
        public ActionResult Apps()
        {
            return View();
        }
        public ActionResult Setting()
        {
            return View();
        }

        public ActionResult Employees()
        {
            return View();
        }

        public ActionResult EmployeeEdit(Guid? id)
        {
            var model = new LocalEmployeeViewModel();
            if (id.HasValue)
            {
                model = _shareService.LocalEmployeeOne(id.Value);
            }

            ViewData["Orgs"] = _shareService.OrganizationBaseList();
            ViewData["Pos"] = _shareService.JobPositionBaseList();

            return PartialView("/Views/" + _version + "/" + _browser + "/General/Partials/EmployeeEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult EmployeeEdit(LocalEmployeeEditModel model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;

            var result = _shareService.LocalEmployeeCommand(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LocalEmployeeMany(SearchEmployeeModel model, OptionResult option)
        {
            var result = _shareService.LocalEmployeeMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeleteEmployeeByIds(List<Guid> ids)
        {
            _shareService.DeleteEmployeeByIds(ids, _authData.EmployeeId);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveAppSetting(List<LocalSetting> models)
        {
            foreach (var appSetting in models)
            {
                if (appSetting.Section == "admin_pass")
                {
                    if (appSetting.Value.HasValue())
                    {
                        _shareService.CheckDbConnect();

                        var auth = _shareService.Context.LocalEmployees.FirstOrDefault(x => x.LoginName == "admin");
                        if (auth != null)
                        {
                            auth.Password = Crypto.HashPassword(appSetting.Value);
                            _shareService.Context.SaveChanges();

                        }
                    }
                }
                else
                {
                    _shareService.LocalSettingCommand(appSetting);
                }
            }
            _shareService.Caching.Delete("Setting", "general");
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        #region QuocGia

        public ActionResult NationEdit(int? id)
        {
            var model = new LocalNation();
            if (id.HasValue)
            {
                model = _shareService.NationOne(id.Value);
            }
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/NationEdit.cshtml", model);
        }

        public JsonResult NationBaseList()
        {
            var result = _shareService.NationBaseList();
            return Json(result, JsonRequestBehavior.AllowGet); 
        }
		public JsonResult NationList(SearchNationModel model, OptionResult option)
		{
            var result = _shareService.NationMany(model, option).Many;
			return Json(result, JsonRequestBehavior.AllowGet);
		}
		[HttpPost]
        public JsonResult NationEdit(LocalNation model)
        {
            var c = _shareService.LocalNationCommand(model);
            return Json(c, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteNationByIds(List<int> ids)
        {
            _shareService.DeleteLocalNationByIds(ids);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region TỈNH / THÀNH PHỐ

        public ActionResult CountryView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/CountryView.cshtml");
        }
        public ActionResult CountryEdit(int? id)
        {
            var model = new LocalCountry();
            if (id.HasValue)
            {
                model = _shareService.CountryOne(id, null);
            }
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/CountryEdit.cshtml", model);
        }
		public JsonResult CountryBaseList(int nationId)
		{
            var result = _shareService.CountryBaseList(nationId);
			return Json(result, JsonRequestBehavior.AllowGet);
		}
		[HttpPost]
        public JsonResult CountryEdit(LocalCountry model)
        {
            var c = model.Id == 0 ? _shareService.CreateLocalCountry(model) : _shareService.EditLocalCountry(model);
            return Json(c, JsonRequestBehavior.AllowGet);
        }
        public ActionResult CountryList(SearchCountryModel model, OptionResult option)
        {
            var result = _shareService.CountryMany(model, option).Many;
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteCountryByIds(List<int> ids)
        {
            _shareService.DeleteLocalCountryByIds(ids);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region  QUẬN / HUYỆN
        public ActionResult DistrictView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/DistrictView.cshtml");

        }
		public JsonResult DistrictBaseList(int countryId)
		{
			var result = _shareService.DistrictBaseList(countryId);
			return Json(result, JsonRequestBehavior.AllowGet);
		}
		public ActionResult DistrictList(SearchDistrictModel model, OptionResult option)
        {
            var result = _shareService.DistrictMany(model, option).Many;
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DistrictEdit(int? id, int? countryId)
        {
            var model = new LocalDistrict()
            {
                CountryId = countryId ?? 0
            };
            if (id.HasValue)
            {
                model = _shareService.DistrictOne(id.Value);
            }

            ViewData["Countries"] = _shareService.CountryMany(new SearchCountryModel()
            {
                Cache = true,
                Nation = 80
            }, new OptionResult() { Unlimited = true }).Many;
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/DistrictEdit.cshtml", model);
        }
        [HttpPost]
        public JsonResult DistrictEdit(LocalDistrict model)
        {
            var c = model.Id == 0 ? _shareService.CreateLocalDistrict(model) : _shareService.EditLocalDistrict(model);
            return Json(c, JsonRequestBehavior.AllowGet);
        }
        public ActionResult WardEdit(int? id, int? districtId)
        {
            var model = new LocalWard()
            {
                DistrictId = districtId ?? 0
            };
            if (id.HasValue)
            {
                model = _shareService.WardOne(id.Value);
            }

            ViewData["Countries"] = _shareService.CountryMany(new SearchCountryModel()
            {
                Cache = true,
                Nation = 80
            }, new OptionResult() { Unlimited = true }).Many;

            var districts = new List<LocalDistrict>();
            if (model.DistrictId > 0)
            {
                var d = _shareService.DistrictOne(model.DistrictId);
                if (d != null)
                {
                    districts = _shareService.DistrictMany(new SearchDistrictModel()
                    {
                        Cache = false,
                        CountryId = d.CountryId
                    }, new OptionResult() { Unlimited = true }).Many;
                    ViewData["CountryId"] = d.CountryId;
                }
            }

            ViewData["Districts"] = districts;

            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/WardEdit.cshtml", model);
        }
        [HttpPost]
        public JsonResult WardEdit(LocalWard model)
        {
            var c = _shareService.LocalWardCommand(model);
            return Json(c, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteDistrictByIds(List<int> ids)
        {
            _shareService.DeleteLocalDistrictByIds(ids);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region PHƯỜNG , XÃ
        public ActionResult WardList(SearchWardModel model, OptionResult option)
        {
            var result = _shareService.WardMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
		public JsonResult WardBaseList(int districtId)
		{
			var result = _shareService.WardBaseList(districtId);
			return Json(result, JsonRequestBehavior.AllowGet);
		}
		#endregion

		#region CHỨC DANH
		public ActionResult JobTitles()
        {
            return View();
        }

        public ActionResult JobTitleView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/JobTitleView.cshtml");
        }

        public ActionResult JobTitleEdit(int? id)
        {
            var model = new LocalJobTitleViewModel();
            if (id.HasValue)
            {
                model = _shareService.LocalJobTitleOne(id.Value);
            }

            return PartialView("/Views/" + _version + "/" + _browser + "/General/Partials/JobTitleEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult JobTitleEdit(LocalJobTitle model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;
            var result = _shareService.LocalJobTitleCommand(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeleteJobTitleByIds(List<int> ids)
        {
            _shareService.DeleteJobTitleByIds(ids, _authData.EmployeeId);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public JsonResult JobTitleList(SearchJobTitleModel model, OptionResult option)
        {
            var result = _shareService.JobTitleMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region VỊ TRÍ CÔNG VIỆC
        public ActionResult JobPositions()
        {
            return View();
        }

        public ActionResult JobPositionList(SearchJobPositionModel model, OptionResult option)
        {
            var result = _shareService.JobPositionViewMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult JobPositionView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/JobPositionView.cshtml");
        }

        public ActionResult JobPositionEdit(int? id)
        {
            var model = new LocalJobPositionViewModel()
            { 
            };
            if (id.HasValue)
            {
                model = _shareService.LocalJobPositionOne(id.Value);
            }

            ViewData["JobTitles"] = _shareService.JobTitleBaseList();
            ViewData["Groups"] = _shareService.GroupBaseList();

            return PartialView("/Views/" + _version + "/" + _browser + "/General/Partials/JobPositionEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult JobPositionEdit(LocalJobPosition model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;
            var result = _shareService.LocalJobPositionCommand(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        } 

        [HttpPost]
        public ActionResult DeleteJobPositionByIds(List<int> ids)
        {
            _shareService.DeleteLocalJobPositionByIds(ids, _authData.EmployeeId);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ActiveJobPosition(int id, bool active)
        {
            var result = _shareService.ActiveLocalJobPosition(id, active);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult JobPositionProcedureView()
        {
            return PartialView("~/views/" + _version + "/" + _browser + "/General/Partials/JobPosition_ProcedureView.cshtml");
        }

        public ActionResult GetNewJobPositionCode()
        {
            var result = _shareService.GetNewJobPositionCode();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Local Employee

        public ActionResult LocalEmployeeEdit(Guid? id)
        {
            var model = id.HasValue ? _shareService.LocalEmployeeOne(id.Value) : new LocalEmployeeViewModel();

            ViewData["JobTitles"] = _shareService.JobTitleBaseList();
            ViewData["Groups"] = _shareService.GroupMany(new SearchGroupModel() { Cache = true },
                new OptionResult() { Unlimited = true }).Many;

            return PartialView("/Views/" + _version + "/" + _browser + "/General/Partials/LocalEmployeeEdit.cshtml", model);
        }
        [HttpPost]
        public ActionResult LocalEmployeeEdit(LocalEmployeeEditModel model)
        {
            model.CreatedBy = _authData.EmployeeId;
            model.UpdatedBy = _authData.EmployeeId;
            var result = _shareService.LocalEmployeeCommand(model);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

		#endregion

		#region setting
		[HttpPost]
		public ActionResult SaveSetting(List<LocalSettingEditModel> models)
		{
			foreach (var appSetting in models)
			{
				if (appSetting.Section == "admin_pass")
				{

					if (appSetting.Value.HasValue())
					{
						_shareService.CheckDbConnect();

						var auth = _shareService.Context.LocalEmployees.FirstOrDefault(x => x.LoginName == "admin");
						if (auth != null)
						{
							auth.Password = Crypto.HashPassword(appSetting.Value);
							_shareService.Context.SaveChanges();

						}
					}
				}
				else
				{
					_shareService.LocalSettingCommand(appSetting);
				}
			}
			_shareService.Caching.Delete("general", "localsettings");
			return Json(true, JsonRequestBehavior.AllowGet);
		}

		#endregion

		//Container
	}
}