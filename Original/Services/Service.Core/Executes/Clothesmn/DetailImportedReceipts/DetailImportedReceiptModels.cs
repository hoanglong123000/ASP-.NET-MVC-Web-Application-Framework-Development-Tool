using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.DetailImportedReceipts
{
    public class SearchDetailImportedReceiptModel
    {
        public string Keyword { get; set; }
        public List<int> Ids { get; set; }
        /*public int? Status { get; set; }
        public int? IsOnlineShop { get; set; }*/

    }

    public class DetailImportedReceiptViewModel : DetailImportedReceipt
    {
        
        /*public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }*/
       /* public BaseItem ObjStatus { get; set; }
        public BaseItem ObjMethodToShop { get; set; }*/
        public BaseItem ObjName { get; set; }
    }

    public class DetailImportedReceiptEditModel : DetailImportedReceipt
    {
        
    }
}
