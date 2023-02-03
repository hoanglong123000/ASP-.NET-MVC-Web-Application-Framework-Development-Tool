using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.TradeHistories
{
    public class SearchTradeHistorieModel
    {
        public List<int> Ids { get; set; }
        public string Keyword { get; set; }
        public int? ClothesId { get; set; }
        public DateTime datefrom { get; set; }
        public DateTime dateto { get; set; }
    }

    public class TradeHistorieViewModel : TradeHistorie
    {
        
       /* public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjSize { get; set; }
        public BaseItem ObjBrand { get; set; }
        public BaseItem ObjType { get; set; }*/
        public BaseItem ObjClothesName { get; set; }
        public BaseItem ObjStatus { get; set; }
       
    }

    public class TradeHistorieEditModel : TradeHistorie
    {
        
    }

    public class TradeReport
    {
         public BaseItem ObjClothes { get; set; }
         public int TDK { get; set; }
         public int AmountImported { get; set; }
         public int AmountExported { get; set; }
         public int TCK { get; set; }
         public int Id { get; set; }
    }
}
