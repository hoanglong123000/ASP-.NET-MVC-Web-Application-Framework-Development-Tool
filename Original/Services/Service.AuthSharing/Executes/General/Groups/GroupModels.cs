using System.Collections.Generic;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.FeatureGroups;
using Service.Core.Executes.General.FeatureGroups;

namespace Service.AuthSharing.Executes.General.Groups
{
    public class LocalGroupViewModel : LocalGroup
    {
        public List<LocalFeatureGroupViewModel> FeatureGroups { get; set; }
    }
    public class LocalGroupEditModel : LocalGroup
    {
        public List<LocalFeatureGroup> FeatureGroups { get; set; }
        public string FeatureGroupStr { get; set; }
        public string DashboardReportGroupStr { get; set; }
        
        public bool UpdateGroup { get; set; }
        
    }
     
}