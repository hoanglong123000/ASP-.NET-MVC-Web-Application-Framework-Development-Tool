using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization; 
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public class Foo
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        // other props
    }

    public class BaseService
    {
        public JavaScriptSerializer Serializer => new JavaScriptSerializer();
        public CachingComponent Caching { get; set; }

        public List<Foo> GetChildItems(List<Foo> foos, int id)
        {
            return foos
                .Where(x => x.ParentId == id)
                .Union(foos.Where(x => x.ParentId == id)
                    .SelectMany(y => GetChildItems(foos, y.Id))
                ).ToList();
        }

        public OptionResult RepairOption(OptionResult option)
        {
            if (option != null)
            {
                if (!option.Page.HasValue || option.Page.Value == 0)
                {
                    option.Page = 1;
                }
                option.Page = option.Page.Value - 1;
                if (!option.Limit.HasValue)
                {
                    option.Limit = 20;
                }
            }
            else
            {
                option = new OptionResult
                {
                    Page = 0,
                    Limit = 20
                };
            }

            option.Skip = option.Skip ?? option.Page.Value * option.Limit.Value;

            return option;
        }
    }
}
