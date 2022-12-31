using System.Collections.Generic;
using DBServer.Entities; 
using Service.Education.Executes.General.FeatureGroups; 

namespace Service.Education.Executes.General.Groups
{
    public class GroupViewModel : Group
    {
        public List<FeatureGroupViewModel> FeatureGroups { get; set; } 
    }
    public class GroupEditModel : Group
    {
        public List<FeatureGroup> FeatureGroups { get; set; }
        public string FeatureGroupStr { get; set; }
        public string DashboardReportGroupStr { get; set; }
        
        public bool UpdateGroup { get; set; }
        
    }

    public class SearchGroupModel
    {
        public bool Cache { get; set; }
        public string Keyword { get; set; }
    }

    public class EmployeeFeatureGroupModel
    {
        public Employee Employee { get; set; } 
    }
}