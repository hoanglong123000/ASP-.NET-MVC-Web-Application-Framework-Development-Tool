using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.TypeClothes
{
    public class SearchTypeClotheModel
    {
        public List<int> Ids { get; set; }
        public string Keyword { get; set; }

    }

    public class TypeClotheViewModel : TypeClothe
    {

        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjType { get; set;  }
    }

    public class TypeClotheEditModel : TypeClothe
    {

    }

}
