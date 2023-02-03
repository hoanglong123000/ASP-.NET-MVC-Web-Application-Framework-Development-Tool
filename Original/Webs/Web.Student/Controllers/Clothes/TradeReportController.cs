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

        

        public ActionResult TradeReportTable(DateTime datefrom, DateTime dateto, OptionResult option)
        {
            // Khoi tao cac bien gia tri.
            ViewData["datefrom"] = datefrom.FormatDate("dd/MM/yyyy");
            ViewData["dateto"] = dateto.FormatDate("dd/MM/yyyy");
            var result = _educationService.TradeHistorieSearchList(datefrom, dateto, option);

            // Khoi tao list de luu tru ma san pham.
            var list = new List<int>();
            foreach (var item in result.Many)
            {
                list.Add(item.ClothesId);
                
            }
            list = list.Distinct().OrderBy(x => x).ToList();

            // Gan danh sach bao gom ma sp va ten sp tu Clothes.
            var clothesnames = _educationService.ClothesNameList(new SearchClothModel
            {
                Ids = list
            });



            // Tinh tong nhap, xuat.
            var resultData = new List<TradeReport>();
            for (int i = 0; i < list.Count(); i++)
            {
                var ImportedSum = 0;
                var ExportedSum = 0;
                var ImportedSumBefore = 0;
                var ExportedSumBefore = 0;
                // Tinh so ton dau ky (TDK).
                _educationService.CheckDbConnect();
                int idClo = list[i];
                var before = _educationService.Context.TradeHistories.Where(x => ((x.ClothesId == idClo) && (x.TradeTime < datefrom))).ToList();


                foreach(var item in before)
                {
                    if (item.Status == 1 && item.ClothesId == idClo)
                    {
                        ImportedSumBefore += item.Amount;
                    }
                    if (item.Status == 0 && item.ClothesId == idClo)
                    {
                        ExportedSumBefore += item.Amount;
                    }
                }
                var TCKBefore = ImportedSumBefore - ExportedSumBefore;

                
                foreach (var item in result.Many)
                {
                    if (item.Status == 1 && item.ClothesId == idClo)
                    {
                        ImportedSum += item.Amount;
                    }
                    if(item.Status == 0 && item.ClothesId == idClo)
                    {
                        ExportedSum += item.Amount;
                    }

                }
                 
               // var name = new BaseItem;
                


                // Assign value to TradeReport.
                resultData.Add(new TradeReport {
                    ObjClothes = clothesnames.FirstOrDefault(x => x.Id == idClo),
                    TDK = TCKBefore,
                    AmountImported = ImportedSum,
                    AmountExported = ExportedSum,
                    TCK = TCKBefore + ImportedSum - ExportedSum,
                    Id = idClo,
                   
            });
            }
            return PartialView("~/Views/" + _browser + "/Education/Partials/TradeReportTable.cshtml", resultData);
        }
    }
}