using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.General.OptionValues;
using Service.Utility.Components; 
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    { 
        public QueryResult<OptionValueViewModel> OptionValueMany(SearchOptionValueModel model, OptionResult optionResult)
        {
            CheckDbConnect();
            IQueryable<LocalOptionValue> q = Context.LocalOptionValues.Where(x => x.Status >= 0);
            if (model.Ids != null && model.Ids.Any())
            {
                q = q.Where(x => model.Ids.Contains(x.Id));
            }
            if (!string.IsNullOrEmpty(model.Keyword))
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword.ToLower()));
            }

            if (model.Code.HasValue())
            {
                q = q.Where(x => x.Code.Contains(model.Code));
            }

            if (!string.IsNullOrEmpty(model.Type))
            {
                q = q.Where(x => x.Type == model.Type);
            }

            if (model.MoRong1.HasValue())
            {
                q = q.Where(x => x.MoRong1 == model.MoRong1);
            }
             
            var r = q.Select(x => new OptionValueViewModel()
            {
                Id = x.Id,
                Name = x.Name,
                AllowChange = x.AllowChange,
                Note = x.Note,
                Type = x.Type, 
                Priority = x.Priority,
                Status = x.Status,
                UpdatedDate = x.UpdatedDate,
                UpdatedBy = x.UpdatedBy,
                CreatedBy = x.CreatedBy, 
                Code = x.Code,
                MoRong1 = x.MoRong1 
            });
            r = r.OrderBy(x => x.Priority);
            return new QueryResult<OptionValueViewModel>(r, optionResult);
        }

        public List<BaseItem> OptionValueBaseList(string type)
        { 
            if (_dataMethod == 1)
                return _coreService.OptionValueBaseList(type);
             
            var names = new List<string> { "OptionValue" };

            names.Add(type);

            var str = string.Join("_", names);
            var dataStr = Caching.Load(str, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }

            CheckDbConnect();
            IQueryable<LocalOptionValue> query = Context.LocalOptionValues.Where(x => x.Status >= 0 && x.Type == type);
            var data = query.OrderBy(x => x.Priority).Select(x => new BaseItem
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name
            }).ToList();
             
            Caching.Save(str, "general", Serializer.Serialize(data));
            return data;
        }

        public List<BaseItem> LocalOptionValueBaseList(string type)
        { 
            var names = new List<string> { "OptionValue" }; 
            names.Add(type);

            var str = string.Join("_", names);
            var dataStr = Caching.Load(str, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }

            CheckDbConnect();
            IQueryable<LocalOptionValue> query = Context.LocalOptionValues.Where(x => x.Status >= 0 && x.Type == type);
            var data = query.OrderBy(x => x.Priority).Select(x => new BaseItem
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name
            }).ToList();

            Caching.Save(str, "general", Serializer.Serialize(data));
            return data;
        }
    }
}