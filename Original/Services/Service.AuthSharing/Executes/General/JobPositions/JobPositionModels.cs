using System.Collections.Generic;
using DBContext.AuthSharing.Entities;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.General.JobPositions
{ 
    public class LocalJobPositionViewModel : LocalJobPosition
    {
        public int? CountRow { get; set; }
        public BaseItem JobTitle { get; set; }
        public BaseItem ObjGroup { get; set; }
    }
     
}
