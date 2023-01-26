using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.Clothes
{
    public class SearchClothModel
    {
        public string Name { get; set; }
        public string Keyword { get; set; }
        public int? SizeId { get; set; }
        public int? BrandId { get; set; }
        public List<int> Ids { get; set; }
        
    }

    public class ClothViewModel : Cloth
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjSize { get; set; }
        public BaseItem ObjBrand { get; set; }
        public BaseItem ObjType { get; set; }
        
    }

    public class ClothEditModel : Cloth
    {
        
    }
}
