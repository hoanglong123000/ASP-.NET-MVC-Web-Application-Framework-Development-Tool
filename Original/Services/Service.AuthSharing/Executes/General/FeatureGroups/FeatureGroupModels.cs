
using DBContext.AuthSharing.Entities; 

namespace Service.AuthSharing.Executes.General.FeatureGroups
{
    public class LocalFeatureGroupViewModel : LocalFeatureGroup
    {
        public LocalFeature Feature { get; set; }
        public LocalGroup Group { get; set; }
        public bool Last { get; set; }
    } 
}
