
using Service.Education.Executes.General.Features;
using System.Linq;
using DBServer.Entities;
using Service.Utility.Variables;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Feature> CreateFeature(Feature model)
        {
            CheckDbConnect();
            var b = new Feature
            {
                Id = 0,
                Icon = model.Icon,
                Code = model.Code,
                Sidebar = model.Sidebar, 
                Name = model.Name,
                SidebarName = model.SidebarName,
                HasView = model.HasView,
                HasEdit = model.HasEdit,
                HasAdd = model.HasAdd,
                HasDelete = model.HasDelete,
                ProcessCode = model.ProcessCode,
                HasApproval = model.HasApproval,
                ViewAction = model.ViewAction,
                RelateActions = model.RelateActions,
                ParentId = model.ParentId,
                Visible = model.Visible,
                Type = model.Type,
                Priority = Context.Features.Count() + 1
            };

            if (b.Id == 0)
            {
                Context.Features.Add(b);
            }

            Context.SaveChanges();
            Caching.Delete("Features", "general");
            Caching.Delete("FeatureGroup", "general");

            return new CommandResult<Feature>(true, b);
        }
        public CommandResult<Feature> EditFeature(Feature model)
        {
            CheckDbConnect();
            var b = Context.Features.FirstOrDefault(x => x.Id == model.Id);
            if (b == null)
                return null;
             
            b.Code = model.Code;
            b.SidebarName = model.SidebarName;
            b.Name = model.Name;
            b.Icon = model.Icon;
            b.ParentId = model.ParentId;
            b.HasView = model.HasView;
            b.HasAdd = model.HasAdd;
            b.ViewAction = model.ViewAction;
            b.ProcessCode = model.ProcessCode;
            b.HasEdit = model.HasEdit;
            b.HasDelete = model.HasDelete;
            b.Type = model.Type;
            b.RelateActions = model.RelateActions;
            b.HasApproval = model.HasApproval;
            b.Visible = model.Visible;
            b.Sidebar = model.Sidebar;
            b.Priority = model.Priority;
            if (b.Id == 0)
            {
                Context.Features.Add(b);
            }
            Context.SaveChanges();
            Caching.Delete("Features", "general");
            Caching.Delete("FeatureGroup", "general");

            return new CommandResult<Feature>(true, b);
        }
        public void DeleteFeature(int id)
        {
            CheckDbConnect();
            var b = Context.Features.FirstOrDefault(x => x.Id == id);
            if (b != null)
            {
                Context.Features.Remove(b);
                Context.SaveChanges();
                Caching.Delete("Features", "general");
                Caching.Delete("Featurerole", "users");

            }
        }
        public bool ChangePriorityFeature(SearchFeatureModel model)
        {
            CheckDbConnect();
            var query = Context.Features.OrderBy(x => x.Priority);
            var item = query.FirstOrDefault(x => x.Id == model.Id);
            if (item != null)
            {
                var relateItem = Context.Features.FirstOrDefault(x => x.Id == model.NearId);

                switch (model.PriorityPosition)
                {
                    case "before":
                        {

                            if (relateItem != null)
                            {
                                item.Priority = relateItem.Priority - 0.0001;
                                item.ParentId = relateItem.ParentId; 
                                Context.SaveChanges();
                            }
                        }
                        break;
                    case "after":
                        {
                            if (relateItem != null)
                            {
                                item.Priority = relateItem.Priority + 0.0001;
                                item.ParentId = relateItem.ParentId; 
                                Context.SaveChanges();
                            }
                        }
                        break;
                    case "over":
                        {
                            item.ParentId = relateItem.Id;
                            var str = relateItem.Id.ToString(); 
                            var lastchild = Context.Features.Where(x => x.ParentId == relateItem.Id)
                                .OrderByDescending(x => x.Priority).FirstOrDefault();
                            if (lastchild != null)
                            {
                                item.Priority = lastchild.Priority + 0.00001;
                            }
                            else
                            {
                                item.Priority = relateItem.Priority + 0.00001;
                            }

                            Context.SaveChanges();
                        }
                        break;
                }
            }
            Caching.Delete("Features", "general");
            Caching.Delete("FeatureGroup", "general");
            return true;
        }
    }
}
