
using DBServer.Entities;
using Service.Education.Executes.General.Features;

namespace Service.Education.Executes.General.FeatureGroups
{
    public class FeatureGroupViewModel : FeatureGroup
    {
        public Feature Feature { get; set; }
        public Group Group { get; set; }
    }

    public class SearchFeatureGroupModel
    {
        public bool Cache { get; set; }
        public int? GroupId { get; set; }
        public string Groups { get; set; }
        public int? FeatureId { get; set; }
        public int? FeatureType { get; set; }
    }
}
