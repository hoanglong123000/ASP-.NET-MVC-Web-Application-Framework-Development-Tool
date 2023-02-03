using System.Collections.Generic;
using System.Linq; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using Service.Core.Executes.Employees.Employees;
using Service.Education.Executes.Clothesmn.Clothes;
using System.Drawing;
using Service.Education.Executes.Clothesmn.Brands;
using Service.Education.Executes.Clothesmn.SizeTabs;
using Service.Education.Executes.Clothesmn.TradeHistories;
using System;
using System.CodeDom;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public QueryResult<TradeHistorieViewModel> TradeHistorieMany(SearchTradeHistorieModel model, OptionResult optionResult)
        {
            /*if (model.Cache)
            {
                var arr = new List<string> { "Brand" };
                if (optionResult.Unlimited)
                {
                    arr.Add("u");
                }

                var name = string.Join("_", arr);
                var dataStr = Caching.Load(name, "Educations");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<QueryResult<BrandViewModel>>(dataStr);
                }
                var data = StudentData(model, optionResult);
                Caching.Save(name, "Educations", Serializer.Serialize(data));
                return data;
            }*/
            return TradeHistorieData(model, optionResult);
        }

        public QueryResult<TradeHistorieViewModel> TradeHistorieData(SearchTradeHistorieModel model, OptionResult optionResult)
        {
            CheckDbConnect();
            IQueryable<TradeHistorie> q = Context.TradeHistories.Where(x => x.Status >= 0);

           /* if (model.Keyword.HasValue())
            {
                var k = model.Keyword.OptimizeKeyword();
                q = q.Where(x => x.Keyword.Contains(k));
            }

            if(model.ClothesId.HasValue)
            {
                q = q.Where(x => x.ClothesId == model.ClothesId);
            }*/

           /*if(model.BrandId.HasValue)
            {
                q = q.Where(x => x.BrandId == model.BrandId);
            }*/
            /*if (model.CreatedDateFrom.HasValue)
            {
                q = q.Where(x => x.CreatedDate >= model.CreatedDateFrom.Value);
            }
            if (model.CreatedDateTo.HasValue)
            {
                var td = model.CreatedDateTo.Value.AddDays(1).AddMilliseconds(-1);
                q = q.Where(x => x.CreatedDate <= td);
            }
            if (model.UpdatedDateFrom.HasValue)
            {
                q = q.Where(x => x.UpdatedDate >= model.UpdatedDateFrom.Value);
            }
            if (model.UpdatedDateTo.HasValue)
            {
                var td = model.UpdatedDateTo.Value.AddDays(1).AddMilliseconds(-1);
                q = q.Where(x => x.UpdatedDate <= td);
            }
            if (model.Ids != null)
            {
                q = q.Where(x => model.Ids.Contains(x.Id));
            }
            if (model.NgaySinhFrom.HasValue)
            {
                q = q.Where(x => x.NgaySinh >= model.NgaySinhFrom.Value);
            }
            if (model.NgaySinhTo.HasValue)
            {
                var td = model.NgaySinhTo.Value.AddDays(1).AddMilliseconds(-1);
                q = q.Where(x => x.NgaySinh <= td);
            }
            if (model.GioiTinh.HasValue)
            {
                q = q.Where(x => x.GioiTinh == model.GioiTinh.Value);
            }
            if (model.GroupId.HasValue)
            {
                q = q.Where(x => x.GroupId == model.GroupId.Value);
            }*/

            #region READ TradeHistorie LIST.
            var r = q.Select(x => new TradeHistorieViewModel
            {
                Id = x.Id,
                Status = x.Status,
                Keyword = x.TradeTime.ToString(),
                ClothesId = x.ClothesId,
                TradeTime = x.TradeTime,
                Amount = x.Amount
                
            });

            r = r.OrderByDescending(x => x.Id);

            var result = new QueryResult<TradeHistorieViewModel>(r, optionResult);

            if (result.Many.Any())
            {
                // LINQ for CRUD operation.
                /*var ids = result.Many.Select(x => x.UpdatedBy).ToList();
                ids.AddRange(result.Many.Select(x => x.CreatedBy).ToList());*/
                var clothesname = result.Many.Select(x => x.ClothesId).ToList();
                /*var sizeids = result.Many.Select(x => x.SizeId).ToList();
                var brandids = result.Many.Select(x => x.BrandId).ToList();

                /*ids = ids.Distinct().ToList();*/

                // Using TypeClothes table in SQL Server instead of OptionValue table which is already available in project.
                var clothesnames = ClothesNameList(new SearchClothModel
                {
                    Ids = clothesname
                });
                var TradeHistoriestatus = _shareService.OptionValueBaseList("TradeHistorieStatus");
               /* var brands = ClothBrandList(new SearchBrandModel
                {
                    Ids = brandids
                });

                var emps = _shareService.EmployeeBaseList(new SearchEmployeeModel
                {
                    Ids = ids
                });
*/
                // Using Brands table in SQL Server instead of OptionValue table which is already available in SQL Server.


                // Using OptionValue table that is already available in project instead of SizeTabs table in SQL Sever.
                /*var sizes = _shareService.OptionValueBaseList("SizeTabs");*/




                foreach (var item in result.Many)
                {
                   /* item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                    item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
                    item.ObjBrand = brands.FirstOrDefault(x => x.Id == item.BrandId)*/;

                    item.ObjClothesName = clothesnames.FirstOrDefault(x => x.Id == item.ClothesId);
                    /* item.ObjType = types.FirstOrDefault(x => x.Id == item.TypeId);*/
                    item.ObjStatus = TradeHistoriestatus.FirstOrDefault(x => x.Code == item.Status.ToString());
                }
            }

            return result;
        }




        public QueryResult<TradeHistorieViewModel> TradeHistorieSearchList(DateTime datefrom, DateTime dateto, OptionResult optionResult)
        {
            CheckDbConnect();
            IQueryable<TradeHistorie> q = Context.TradeHistories.Where(x => (x.TradeTime >= datefrom) && (x.TradeTime <= dateto));

            
            var r = q.Select(x => new TradeHistorieViewModel
            {
                Id = x.Id,
                Status = x.Status,
                Keyword = x.TradeTime.ToString(),
                ClothesId = x.ClothesId,
                TradeTime = x.TradeTime,
                Amount = x.Amount

            });

            r = r.OrderByDescending(x => x.Id);

            var result = new QueryResult<TradeHistorieViewModel>(r, optionResult);
            



            if (result.Many.Any())
            {
                // LINQ for CRUD operation.
                /*var ids = result.Many.Select(x => x.UpdatedBy).ToList();
                ids.AddRange(result.Many.Select(x => x.CreatedBy).ToList());*/
                var clothesname = result.Many.Select(x => x.ClothesId).ToList();
                /*var sizeids = result.Many.Select(x => x.SizeId).ToList();
                var brandids = result.Many.Select(x => x.BrandId).ToList();

                /*ids = ids.Distinct().ToList();*/

                // Using TypeClothes table in SQL Server instead of OptionValue table which is already available in project.
                var clothesnames = ClothesNameList(new SearchClothModel
                {
                    Ids = clothesname
                });
                var TradeHistoriestatus = _shareService.OptionValueBaseList("TradeHistorieStatus");
                
                /* var brands = ClothBrandList(new SearchBrandModel
                 {
                     Ids = brandids
                 });

                 var emps = _shareService.EmployeeBaseList(new SearchEmployeeModel
                 {
                     Ids = ids
                 });
 */
                // Using Brands table in SQL Server instead of OptionValue table which is already available in SQL Server.


                // Using OptionValue table that is already available in project instead of SizeTabs table in SQL Sever.
                /*var sizes = _shareService.OptionValueBaseList("SizeTabs");*/




                foreach (var item in result.Many)
                {
                    /* item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                     item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
                     item.ObjBrand = brands.FirstOrDefault(x => x.Id == item.BrandId)*/
                    ;

                    item.ObjClothesName = clothesnames.FirstOrDefault(x => x.Id == item.ClothesId);
                    
                    /* item.ObjType = types.FirstOrDefault(x => x.Id == item.TypeId);*/
                    item.ObjStatus = TradeHistoriestatus.FirstOrDefault(x => x.Code == item.Status.ToString());
                }
            }

            return result;
        }

        // LINQ  ClothTypeList to map into Clothes table in SQL Server.
        public List<BaseItem> ClothesNameList(SearchClothModel searchClothModel)
        {
            CheckDbConnect();
            var list = Context.Clothes.Select(x => new BaseItem { Id = x.Id, Name = x.Name }).ToList();
            foreach (var item in list)
            {
                var a = item.Name;
            }
            return list;
        }

        

        
        /*public List<BaseItem> StudenBaseList()
        {
            CheckDbConnect();

            var list = Context.Students.Select(x => new BaseItem
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();

            foreach(var item in list)
            {
                var a = item.Name;
            }

            return list;
        }*/

        #endregion
    }
}