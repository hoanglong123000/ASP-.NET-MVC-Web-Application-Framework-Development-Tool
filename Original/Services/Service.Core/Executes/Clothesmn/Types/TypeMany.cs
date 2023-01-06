using System.Collections.Generic;
using System.Linq; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using Service.Core.Executes.Employees.Employees;
using Service.Education.Executes.Clothesmn.TypeClothes;
using System.Drawing;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public QueryResult<TypeClotheViewModel> TypeMany(SearchTypeClotheModel model, OptionResult optionResult)
        {
            /*if (model.Cache)
            {*/
                /*var arr = new List<string> { "Brand" };
                if (optionResult.Unlimited)
                {
                    arr.Add("u");
                }

                var name = string.Join("_", arr);
                var dataStr = Caching.Load(name, "Educations");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<QueryResult<BrandViewModel>>(dataStr);
                }*//*
                var data = StudentData(model, optionResult);
                Caching.Save(name, "Educations", Serializer.Serialize(data));
                return data;*/
           /* }*/
            return TypeData(model, optionResult);
        }

        private QueryResult<TypeClotheViewModel> TypeData(SearchTypeClotheModel model, OptionResult optionResult)
        {
            CheckDbConnect();
            IQueryable<TypeClothe> q = Context.TypeClothes.Where(x => x.Status >= 0);

            if (model.Keyword.HasValue())
            {
                var k = model.Keyword.OptimizeKeyword();
                q = q.Where(x => x.Keyword.Contains(k));
            }
           /* if (model.CreatedDateFrom.HasValue)
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

            #region READ TYPE LIST.
            var r = q.Select(x => new TypeClotheViewModel
            {
                Id = x.Id,
                Status = x.Status,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate,
                Name = x.Name,
                Keyword = x.Keyword
            });

            r = r.OrderByDescending(x => x.CreatedDate);

            var result = new QueryResult<TypeClotheViewModel>(r, optionResult);

            if (result.Many.Any())
            {
                var ids = result.Many.Select(x => x.UpdatedBy).ToList();
                ids.AddRange(result.Many.Select(x => x.CreatedBy).ToList());

                ids = ids.Distinct().ToList();
                    

                var emps = _shareService.EmployeeBaseList(new SearchEmployeeModel
                {
                    Ids = ids
                });

                foreach (var item in result.Many)
                {
                    item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                    item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy); 
                }
            }

            return result;
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