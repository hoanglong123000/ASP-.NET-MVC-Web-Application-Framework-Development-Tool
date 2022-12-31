using System.Collections.Generic;
using System.Linq;
using DBServer.Entities; 
using Service.Education.Executes.General.Groups;
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        
        public QueryResult<GroupViewModel> GroupMany(SearchGroupModel model, OptionResult option)
        {
            if (model.Cache)
            {
                var cachename = new List<string> { "Groups" };
                var name = string.Join("_", cachename);
                var dataStr = Caching.Load(name, "general");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<QueryResult<GroupViewModel>>(dataStr);
                }
                CheckDbConnect();
                var Groups = GroupData(model, option);
                Caching.Save(name, "general", Serializer.Serialize(Groups));
                return Groups;
            }
            return GroupData(model, option);
        }

        private QueryResult<GroupViewModel> GroupData(SearchGroupModel model, OptionResult option)
        {
            CheckDbConnect();
            IQueryable<Group> query = Context.Groups.Where(x => x.Status >= 0);

            if (model.Keyword.HasValue())
            {
                query = query.Where(x => x.Keyword.Contains(model.Keyword));
            }

            var r = query.Select(x => new GroupViewModel()
            {
                Id = x.Id,
                Name = x.Name,
                Priority = x.Priority,
                Code = x.Code,
                AllowHrm = x.AllowHrm,
                AllowData = x.AllowData,
                AllowPortal = x.AllowPortal,
                Description = x.Description,
                Status = x.Status
            });

            r = r.OrderBy(x => x.Priority);

            return new QueryResult<GroupViewModel>(r, option);
        }
         
    }
}