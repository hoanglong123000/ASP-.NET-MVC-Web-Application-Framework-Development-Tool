using System.Collections.Generic;
using DBContext.AuthSharing.Entities;


namespace Service.AuthSharing.Executes.General.Features
{
    public class LocalFeatureEditModel : LocalFeature
    {
        
    }
    public class LocalFeatureViewModel : LocalFeature
    {
        public int TotalChild { get; set; }
    } 
}