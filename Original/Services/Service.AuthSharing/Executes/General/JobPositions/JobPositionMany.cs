using System;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Utility.Variables;
using Service.Utility.Components;
using Service.Core.Executes.Category.JobPositions;
using Service.Core.Executes.General.Groups;
using DBContext.Core.Entities;
using System.Collections.Generic;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public QueryResult<JobPositionViewModel> JobPositionViewMany(SearchJobPositionModel model, OptionResult option)
        {
            if (_dataMethod == 1)
                return _coreService.JobPositionViewMany(model, option);

            CheckDbConnect();
            IQueryable<LocalJobPosition> query = Context.LocalJobPositions;
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

            if (model.GroupId.HasValue)
            {
                query = query.Where(x => x.GroupId == model.GroupId.Value);
            }
            if (model.JobTitleId.HasValue)
            {
                query = query.Where(x => x.JobTitleId == model.JobTitleId.Value);
            }

            var r = query.Select(x => new JobPositionViewModel()
            {
                Name = x.Name,
                Id = x.Id,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                JobTitleId = x.JobTitleId,
                Status = x.Status,
                GroupId = x.GroupId,
                RequestRecruitment = x.RequestRecruitment,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate,
                ExternalTitle = x.ExternalTitle,
                Jobs = x.Jobs, 
                Priority = x.Priority,
                Active = x.Active
            });
            r = r.OrderBy(x => x.Priority);

            var result = new QueryResult<JobPositionViewModel>(r, option);
            if (result.Many.Any())
            {
                var titles = JobTitleMany(new Core.Executes.General.JobTitles.SearchJobTitleModel
                {
                    Cache = true
                }, new OptionResult
                {
                    Unlimited = true
                }).Many;

                foreach (var item in result.Many)
                {
                    if (item.JobTitleId.HasValue)
                    {
                        item.JobTitle = titles.FirstOrDefault(x => x.Id == item.JobTitleId);
                    }
                }
                var groupUsers = GroupMany(new SearchGroupModel()
                {
                    Cache = true
                }, new OptionResult() { Unlimited = true }).Many;
                foreach (var item in result.Many)
                {
                    if (item.GroupId.HasValue)
                    {
                        item.ObjGroup = groupUsers.FirstOrDefault(x => x.Id == item.GroupId.Value);
                    }
                }
            }

            return result;
        }

        public QueryResult<JobPosition> JobPositionMany(SearchJobPositionModel model, OptionResult option)
        {

            if (_dataMethod == 1)
                return _coreService.JobPositionMany(model, option);

            if (model.Cache)
            {
                var name = "JobPositions";
                if (option.Unlimited)
                {
                    name += "_u";
                }
                var dataStr = Caching.Load(name, "general");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<QueryResult<JobPosition>>(dataStr);
                }

                var data = JobPositionData(model, option);
                Caching.Save(name, "general", Serializer.Serialize(data));
                return data;
            }

            return JobPositionData(model, option);
        }

        private QueryResult<JobPosition> JobPositionData(SearchJobPositionModel model, OptionResult option)
        {
            CheckDbConnect();
            IQueryable<LocalJobPosition> q = Context.LocalJobPositions;
            if (!string.IsNullOrEmpty(model.Keyword))
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            }
            if (model.Status.HasValue)
            {
                q = q.Where(x => x.Status == model.Status.Value);
            }
            else
            {
                q = q.Where(x => x.Status >= 0);
            }

            if (model.JobTitleId.HasValue)
            {
                q = q.Where(x => x.JobTitleId == model.JobTitleId.Value);
            }

            if (model.GroupId.HasValue)
            {
                q = q.Where(x => x.GroupId == model.GroupId.Value);
            }



            var r = q.Select(x => new JobPosition
            {
                Id = x.Id,
                Name = x.Name, 
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate,
                JobTitleId = x.JobTitleId,
                GroupId = x.GroupId,
                Priority = x.Priority,
                Active = x.Active
            });
            r = r.OrderBy(x => x.Priority);

            var result = new QueryResult<JobPosition>(r, option);

            return result;
        }

        public List<BaseItem> JobPositionBaseList()
        {
            if (_dataMethod == 1)
                return _coreService.JobPositionBaseList();

            var name = "JobPosition_bases";
            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }
            CheckDbConnect();
            var data = Context.LocalJobPositions.Where(x => x.Active && x.Status >= 0)
                .Select(x => new BaseItem() { Id = x.Id,  Name = x.Name })
                .ToList();
            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;

        }
    }
}
