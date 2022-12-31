using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using Microsoft.Office.Interop.Word;
using Service.AuthSharing.Executes.General.JobTitles;
using Service.Core.Executes.General.JobTitles;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public QueryResult<JobTitleViewModel> JobTitleMany(SearchJobTitleModel model, OptionResult option)
        { 
            if (_dataMethod == 1)
            {
                return _coreService.JobTitleMany(model, new OptionResult { Unlimited = true });
            }

            CheckDbConnect();

            IQueryable<LocalJobTitle> query = Context.LocalJobTitles;
            if (!string.IsNullOrEmpty(model.Keyword))
            {
                query = query.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Status.HasValue)
            {
                query = query.Where(x => x.Status == model.Status.Value);
            }
            else
            {
                query = query.Where(x => x.Status >= 0);
            }
             

            if (!string.IsNullOrEmpty(model.Ids))
            {
                var arr = model.Ids.Split(',').Select(Int32.Parse).ToList();
                query = query.Where(x => arr.Contains(x.Id));
            } 
            var r = query.Select(x => new JobTitleViewModel()
            {
                Name = x.Name, 
                Id = x.Id,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                Priority = x.Priority, 
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
            r = r.OrderBy(x => x.Priority);
            var result = new QueryResult<JobTitleViewModel>(r, option);
            if (result.Many.Any())
            {

            }
            return result;
        }

        public List<BaseItem> JobTitleBaseList()
        {
            if (_dataMethod == 1)
                return _coreService.JobTitleBaseList();
             
            var name = "JobTitleBaseList";
            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }
            CheckDbConnect();
            var data = Context.LocalJobTitles.Where(x => x.Status >= 0).Select(x => new BaseItem()
            {
                Id = x.Id, 
                Name = x.Name
            }).ToList();
            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;
        }

        public List<JobTitle> JobTitleList(SearchJobTitleModel model)
        {
            if (_dataMethod == 1)
            {
                return _coreService.JobTitleList();
            }

            CheckDbConnect();
            IQueryable<LocalJobTitle> query = Context.LocalJobTitles;

            if (!string.IsNullOrEmpty(model.Keyword))
            {
                query = query.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Status.HasValue)
            {
                query = query.Where(x => x.Status == model.Status.Value);
            }
            else
            {
                query = query.Where(x => x.Status >= 0);
            }
             

            if (!string.IsNullOrEmpty(model.Ids))
            {
                var arr = model.Ids.Split(',').Select(Int32.Parse).ToList();
                query = query.Where(x => arr.Contains(x.Id));
            } 
            var r = query.Select(x => new JobTitle()
            {
                Name = x.Name, 
                Id = x.Id,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                Priority = x.Priority, 
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
            r = r.OrderBy(x => x.Priority);
            var result = new QueryResult<JobTitle>(r, new OptionResult { Unlimited = true }).Many;

            return result;
        }
    }
}
