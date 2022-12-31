using System.Collections.Generic;
using System.Linq;
using DBServer.Entities;
using Service.Education.Executes.General.Features;
using Service.Utility.Variables;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public QueryResult<FeatureViewModel> FeatureMany(SearchFeatureModel model, OptionResult options)
        {
            if (model.Cache)
            {
                var cachename = new List<string> { "Features" };
                if (options != null && options.Unlimited)
                {
                    cachename.Add("unlimited");
                }

                if (model.Type.HasValue)
                {
                    cachename.Add("t_" + model.Type.Value);
                }
                var name = string.Join("_", cachename);
                var dataStr = Caching.Load(name, "general");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<QueryResult<FeatureViewModel>>(dataStr);
                }
                var data = FeatureData(model, options);
                Caching.Save(name, "general", Serializer.Serialize(data));
                return data;
            }
            return FeatureData(model, options);
        }

        private QueryResult<FeatureViewModel> FeatureData(SearchFeatureModel model, OptionResult options)
        {
            CheckDbConnect();
            IQueryable<Feature> query = Context.Features;
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
                TotalChild = Context.Features.Count(y => y.ParentId == x.Id)
            }).OrderBy(x => x.Priority).ThenBy(x => x.Id);
            return new QueryResult<FeatureViewModel>(r, options);
        }
    }
}
