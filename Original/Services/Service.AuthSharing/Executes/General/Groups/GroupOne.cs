using System;
using System.Linq;
using Service.Core.Executes.General.FeatureGroups;
using Service.Core.Executes.General.Groups;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public GroupViewModel GroupOne(int? id)
        {
            if(_dataMethod == 1)
                return _coreService.GroupOne(id);

            CheckDbConnect();
            var result = Context.LocalGroups.Where(x => x.Id == id).Select(x => new GroupViewModel()
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name,
                Description = x.Description,
                Priority = x.Priority,
                Status = x.Status, 
                AllowData = x.AllowData
            }).FirstOrDefault();
            if (result != null)
            {
                result.FeatureGroups = FeatureGroupMany(new SearchFeatureGroupModel()
                {
                    GroupId = result.Id
                });
               
                  
            }
            return result;
        }

        public string GetGroupNameById(int? id)
        {
            if (!id.HasValue)
                return "";
            var gs = GroupMany(new SearchGroupModel()
            {
                Cache = true
            }, new OptionResult() {Unlimited = true}).Many;

            var g = gs.FirstOrDefault(x => x.Id == id);
            if (g != null)
                return g.Name;
            return "";
        }
    }
}
