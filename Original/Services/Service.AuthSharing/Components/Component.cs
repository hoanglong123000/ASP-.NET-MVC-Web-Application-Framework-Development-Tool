using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;

namespace Service.AuthSharing.Components
{
    public class IdImgModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Media { get; set; }
        public string Name { get; set; }
        public string ThumbSize { get; set; }
        public int? ShopId { get; set; }
    }
    public static class LocalComponent
    { 
        public static string GetValue(this List<LocalSetting> list, string tab, string section)
        {
            var s = list.FirstOrDefault(x => x.Tab == tab && x.Section == section);
            if (s != null)
                return s.Value;
            return "";
        }
         
    }
}