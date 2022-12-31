using System.Collections.Generic;
using DBServer.Entities;


namespace Service.Education.Executes.General.Features
{
    public class FeatureEditModel : Feature
    {
        
    }
    public class FeatureViewModel : Feature
    {
        public int TotalChild { get; set; }
    }
    public class SearchFeatureModel
    {
        public List<int> Ids { get; set; }
        public bool Cache { get; set; }
        public int? Id { get; set; }
        public int? ParentId { get; set; }
        public string Keyword { get; set; }
        public string PriorityPosition { get; set; }
        public int NearId { get; set; }
        public int? Type { get; set; }
    }
}