 
using System.Linq; 
using Service.Utility.Variables;
using DBContext.AuthSharing.Entities; 

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<LocalFeature> LocalFeatureCommand(LocalFeature model)
        {
            CheckDbConnect();
            var b = new LocalFeature
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
                Priority = Context.LocalFeatures.Count() + 1
            };

            if (b.Id == 0)
            {
                Context.LocalFeatures.Add(b);
            }

            Context.SaveChanges();
            Caching.Delete("Features", "general");
            Caching.Delete("FeatureGroup", "general");

            return new CommandResult<LocalFeature>(true, b);
        }
      
        public void DeleteFeature(int id)
        {
            CheckDbConnect();
            var b = Context.LocalFeatures.FirstOrDefault(x => x.Id == id);
            if (b != null)
            {
                Context.LocalFeatures.Remove(b);
                Context.SaveChanges();
                Caching.Delete("Features", "general");
                Caching.Delete("Featurerole", "users");

            }
        } 
    }
}
