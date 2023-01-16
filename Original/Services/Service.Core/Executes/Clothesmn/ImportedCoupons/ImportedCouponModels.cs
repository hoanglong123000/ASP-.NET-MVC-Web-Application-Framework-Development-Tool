using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.ImportedCoupons
{
    public class SearchImportedCouponModel
    {
        public string Name { get; set; }
        public string Keyword { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public int? ProviderId { get; set; }
    }

    public class ImportedCouponViewModel : ImportedCoupon
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjName { get; set; }
        public BaseItem ObjStatus { get; set; }
        public BaseItem ObjProviderId { get; set; }
    }

    public class ImportedCouponEditModel : ImportedCoupon
    {
        public List<DetailImportedReceipt> detailImportedReceipts { get; set; }
        public List<ImportedCoupon> ImportedCoupons { get; set; }
    }
}
