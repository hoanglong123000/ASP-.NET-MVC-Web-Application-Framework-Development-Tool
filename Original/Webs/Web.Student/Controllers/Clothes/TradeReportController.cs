using DBServer.Entities;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.TradeHistories;
using Service.Utility.Components;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Student.Controllers.Base;

namespace Web.Student.Controllers.Clothes
{
    public class TradeReportController : AuthController
    {
        // GET: TradeReport
        public ActionResult TradeReport()
        {
            return View();
        }

        

        public ActionResult TradeReportTable(DateTime datefrom, DateTime dateto, int mode, OptionResult option)
        {
            // Khoi tao cac bien gia tri.
            ViewData["datefrom"] = datefrom.FormatDate("dd/MM/yyyy");
            ViewData["dateto"] = dateto.FormatDate("dd/MM/yyyy");

            var result = _educationService.TradeHistorieSearchList(datefrom, dateto.AddDays(1).AddSeconds(-1), option);
            var resultData = _educationService.ProcessData(datefrom, mode, result);
                 
                    
                    
            return PartialView("~/Views/" + _browser + "/Education/Partials/TradeReportTable.cshtml", resultData);
        }
    }
}