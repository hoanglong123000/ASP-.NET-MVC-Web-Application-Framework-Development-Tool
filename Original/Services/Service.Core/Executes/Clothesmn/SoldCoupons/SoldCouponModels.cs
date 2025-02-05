﻿using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.SoldCoupons
{
    public class SearchSoldCouponModel
    {
        public string Keyword { get; set; }
        public List<int> Ids { get; set; }
        public int? Status { get; set; }
        public int? IsOnlineShop { get; set; }
        public int? BuyerName { get; set; }

    }

    public class SoldCouponViewModel : SoldCoupon
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjStatus { get; set; }
        public BaseItem ObjMethodToShop { get; set; }
        public List<DetailReceipt> detailReceipts { get; set; }
        public BaseItem ObjNameBuyer { get; set; }
    }

    public class SoldCouponEditModel : SoldCoupon
    {
        public List<DetailReceipt> detailReceipts { get; set; }
        public List<SoldCoupon> soldCoupons { get; set; }
        public List<TradeHistorie> tradeHistorie { get; set; }
    }
}
