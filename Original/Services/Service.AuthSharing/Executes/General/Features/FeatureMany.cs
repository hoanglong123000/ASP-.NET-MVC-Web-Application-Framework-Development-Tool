using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.Features;
using Service.Core.Executes.General.Features;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    { 
        public QueryResult<FeatureViewModel> FeatureMany(SearchFeatureModel model, OptionResult options)
        {
            CheckDbConnect();
            IQueryable<LocalFeature> query = Context.LocalFeatures;
            if (model.ParentId.HasValue)
            {
                query = model.ParentId.Value == 0 ?
                    query.Where(x => x.ParentId == null) :
                    query.Where(x => x.ParentId == model.ParentId.Value);
            }

            if (model.Type.HasValue)
            {
                query = query.Where(x => x.Type == model.Type.Value);
            }

            var r = query.Select(x => new FeatureViewModel()
            {
                Id = x.Id,
                Code = x.Code,
                SidebarName = x.SidebarName,
                Name = x.Name,
                Icon = x.Icon,
                ParentId = x.ParentId,
                HasView = x.HasView,
                ProcessCode = x.ProcessCode,
                Priority = x.Priority, 
                ViewAction = x.ViewAction,
                RelateActions = x.RelateActions,
                HasAdd = x.HasAdd,
                HasEdit = x.HasEdit,
                HasDelete = x.HasDelete,
                HasApproval = x.HasApproval,
                Sidebar = x.Sidebar, 
                Visible = x.Visible,
                Type = x.Type,
                TotalChild = Context.LocalFeatures.Count(y => y.ParentId == x.Id)
            }).OrderBy(x => x.Priority).ThenBy(x => x.Id);
            return new QueryResult<FeatureViewModel>(r, options);
        }
    }
}
