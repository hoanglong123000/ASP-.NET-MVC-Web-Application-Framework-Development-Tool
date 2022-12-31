using System;
using System.Collections.Generic;
using System.Linq; 
using Service.Education.Components;
using Service.Education.Executes.General.OptionValues;
using Service.Utility.Variables;
using Service.Utility.Components;
using DBServer.Entities;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    { 
        public QueryResult<OptionValueViewModel> OptionValueMany(SearchOptionValueModel model, OptionResult optionResult)
        {
            CheckDbConnect();
            IQueryable<OptionValue> query = Context.OptionValues.Where(x => x.Status >= 0);
            if (model.Ids != null && model.Ids.Any())
            {
                query = query.Where(x => model.Ids.Contains(x.Id));
            }
            if (!string.IsNullOrEmpty(model.Keyword))
            {
                query = query.Where(x => x.Keyword.Contains(model.Keyword.ToLower()));
            }

            if (model.Minute.HasValue)
            {
                var now = DateTime.Now;
                var sd = now.AddMinutes(-model.Minute.Value);
                query = query.Where(x => x.UpdatedDate >= sd || x.CreatedDate >= sd);
            }
            if (model.Code.HasValue())
            {
                query = query.Where(x => x.Code.Contains(model.Code));
            }

            if (!string.IsNullOrEmpty(model.Type))
            {
                query = query.Where(x => x.Type == model.Type);
            }

            if (model.MoRong1.HasValue())
            {
                query = query.Where(x => x.MoRong1 == model.MoRong1);
            } 
            query = query.OrderBy(x => x.Priority);
            var data =  new QueryResult<OptionValue>(query, optionResult);

            var result = new QueryResult<OptionValueViewModel>();
            result.Count = data.Count;
            result.Many = data.Many.Select(x => new OptionValueViewModel()
            {   
                Id = x.Id,
                Name = x.Name,
                AllowChange = x.AllowChange,
                Note = x.Note,
                Type = x.Type,
                Priority = x.Priority,
                Status = x.Status, 
                UpdatedBy = x.UpdatedBy,
                CreatedBy = x.CreatedBy, 
                Code = x.Code,
                MoRong1 = x.MoRong1,
                MoRong2 = x.MoRong2,
                MoRong3 = x.MoRong3,
                MoRong4 = x.MoRong4,
                MoRong5 = x.MoRong5
            }).ToList(); 

            return result;
        }

        public List<BaseItem> OptionValueBaseList(string type)
        {
            var names = new List<string> { "OptionValueBaseList" };

            names.Add(type);

            var str = string.Join("_", names);
            var dataStr = Caching.Load(str, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }
            var data = OptionValueBaseData(type);
            Caching.Save(str, "general", Serializer.Serialize(data));
            return data;
        }
        public List<OptionValue> OptionValueSummaryList(string type)
        {
            var names = new List<string> { "OptionValueSummaryList" };

            names.Add(type);

            var str = string.Join("_", names);
            var dataStr = Caching.Load(str, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<OptionValue>>(dataStr);
            }
            CheckDbConnect();
            var data = Context.OptionValues.Where(x => x.Status >= 0 && x.Type == type).ToList();
            Caching.Save(str, "general", Serializer.Serialize(data));
            return data;
        }

        private List<BaseItem> OptionValueBaseData(string type)
        {
            CheckDbConnect();
            IQueryable<OptionValue> query = Context.OptionValues
                .Where(x => x.Status == 1 && x.Type == type );

            var r = query.OrderBy(x => x.Priority).Select(x => new BaseItem
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name
            }).ToList();

            return r;
        }
    }
}