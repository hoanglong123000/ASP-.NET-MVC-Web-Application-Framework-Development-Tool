using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.Brands
{
    public class SearchBrandModel
    {
        public List<int> Ids { get; set; }   
        public string Keyword { get; set; }
           
    }

    public class BrandViewModel : Brand
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjBrand { get; set; }
    }

    public class BrandEditModel : Brand
    {
        
    }
}
