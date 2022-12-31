using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.Groups;
using Service.Core.Executes.General.Groups;
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    { 
        public QueryResult<GroupViewModel>  GroupMany(SearchGroupModel model, OptionResult option)
        {
            if (_dataMethod == 1)
                return _coreService.GroupMany(model, option);

            CheckDbConnect();
            IQueryable<LocalGroup> query = Context.LocalGroups.Where(x => x.Status >= 0);

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
                AllowData = x.AllowData, 
                Status = x.Status
            });

            r = r.OrderBy(x => x.Priority);

            return new QueryResult<GroupViewModel>(r, option);
        }



        public List<BaseItem> GroupBaseList()
        {
            if (_dataMethod == 1)
                return _coreService.GroupBaseList();

            var name = "Group_bases";
            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }
            CheckDbConnect();
            var data = Context.LocalGroups.Where(x => x.Status >= 0)
                .Select(x => new BaseItem() { Id = x.Id, Code = x.Code, Name = x.Name })
                .ToList();
            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;

        }
    }
}