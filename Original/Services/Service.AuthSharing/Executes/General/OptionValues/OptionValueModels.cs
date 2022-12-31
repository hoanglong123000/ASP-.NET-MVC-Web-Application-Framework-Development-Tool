using System.Collections.Generic;
using DBContext.AuthSharing.Entities;


namespace Service.AuthSharing.Executes.General.OptionValues
{
    public class SearchLocalOptionValueModel
    {
        public int? Id { get; set; }
        public int NearId { get; set; }
        public List<int> Ids { get; set; }
        public string Code { get; set; }
        public string Keyword { get; set; }
        public string Type { get; set; }
        public List<string> Types { get; set; }
        public bool Cache { get; set; }
        public string PriorityPosition { get; set; }
        public string MoRong1 { get; set; }
        public string CodeStr { get; set; }
    }

    public class LocalOptionValueViewModel : LocalOptionValue
    {

    }

    public class LocalOptionValueEditModel : LocalOptionValue
    {
        public bool Active { get; set; }
    }
}
