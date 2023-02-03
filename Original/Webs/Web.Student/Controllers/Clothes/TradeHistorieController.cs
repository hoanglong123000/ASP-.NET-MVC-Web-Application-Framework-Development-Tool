using DBServer.Entities;
using Service.Education.Executes.Clothesmn.TradeHistories;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;

namespace Web.Student.Controllers.Clothes
{
    public class TradeHistorieController : AuthController
    {
        // GET: TradeHistorie
        public ActionResult TradeHistorieList()
        {
            return View();
        }


        public JsonResult ViewTradeHistorieList(SearchTradeHistorieModel model, OptionResult option)
        {
            var result = _educationService.TradeHistorieMany(model, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult TradeHistorieOne(int id)
        {
            var result = _educationService.TradeHistorieOne(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult TradeHistorieEdit(int? id)
        {
            var model = id.HasValue ? _educationService.TradeHistorieOne(id.Value) : new TradeHistorieViewModel();

            return PartialView("~/Views/" + _browser + "/Education/Partials/TradeHistorieEdit.cshtml", model);
        }

        [HttpPost]
        public JsonResult TradeHistorieEdit(TradeHistorieEditModel model)
        {
            /*model.UpdatedBy = _authData.EmployeeId;
            if (model.Id == 0)
            {
                model.CreatedBy = _authData.EmployeeId;
            }*/

            var result = model.Id == 0 ? _educationService.CreateTradeHistorie(model) : _educationService.EditTradeHistorie(model);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchClothesIdList()
        {
            var list = new List<Cloth>();
            using (var i = new ServerDBContext())
            {
                list = i.Clothes.Where(x => x.Status >= 0).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // Search Status of TradeHistorie.
        public JsonResult SearchStatusList()
        {
            return Json(_shareService.OptionValueBaseList("TradeHistorieStatus"), JsonRequestBehavior.AllowGet);
        }

        // DELETE Cloth
        [HttpPost]
        public JsonResult DeleteTradeHistorieByIds(List<int> ids)
        {
            _educationService.DeleteTradeHistorieByIds(ids, _authData.EmployeeId);
            return Json(new CommandResult<bool>(true), JsonRequestBehavior.AllowGet);
        }

    }
}