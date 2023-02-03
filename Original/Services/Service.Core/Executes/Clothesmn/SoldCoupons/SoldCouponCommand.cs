using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.SoldCoupons;
using System.Data;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<SoldCoupon> CreateSoldCoupon(SoldCouponEditModel model)
        {
            CheckDbConnect();
            try
            {
                
                // Add Sold Coupon.
                var d = new SoldCoupon
                {
                    Id = model.Id,

                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.UpdatedBy,
                    CreatedBy = model.CreatedBy,
                    SoldDate = DateTime.Now,
                    BuyerName = model.BuyerName,
                    IsOnlineShop = model.IsOnlineShop,
                    Status = model.Status,
                    TotalPrice = model.TotalPrice,
                    
                              
                };
               
                
                Context.SoldCoupons.Add(d);

                // When Status == Sold.
                if (model.Status == 1)
                {
                    // Them vao lich su giao dich.
                    var detailreceiptlst1 = model.detailReceipts.ToList();
                    for (int key = 0; key < detailreceiptlst1.Count; key++)
                    {
                        var tradeHistorie = new TradeHistorie
                        {

                            Status = 0,

                            Amount = detailreceiptlst1[key].Ammount,

                            ClothesId = detailreceiptlst1[key].ClothesId,
                            TradeTime = DateTime.Now
                        };
                        Context.TradeHistories.Add(tradeHistorie);
                        Context.SaveChanges();
                    }
                }

                Context.SaveChanges();




                // Add Detail Receipt.
                var detailreceiptlst = model.detailReceipts.ToList();
                for(int key = 0; key < detailreceiptlst.Count; key++)
                {
                    var detailReceipt = new DetailReceipt
                    {
                        Id = detailreceiptlst[key].Id,
                        Status = detailreceiptlst[key].Status,
                        UnitMeasure = detailreceiptlst[key].UnitMeasure,
                        Ammount = detailreceiptlst[key].Ammount,
                        Price = detailreceiptlst[key].Price,
                        FinalPrice = detailreceiptlst[key].FinalPrice,
                        ClothesId = detailreceiptlst[key].ClothesId,
                        CouponId = d.Id
                    };
                    Context.DetailReceipts.Add(detailReceipt);
                    Context.SaveChanges();
                }

                




                //DeleteCaching 
                return new CommandResult<SoldCoupon>(d);
            }
            catch (DbEntityValidationException e)
            {
                StringBuilder sb = new StringBuilder();
                foreach (var eve in e.EntityValidationErrors)
                {
                    foreach (var ve in eve.ValidationErrors)
                    {
                        sb.AppendLine(string.Format("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName,
                            ve.ErrorMessage));
                    }
                }
                return new CommandResult<SoldCoupon>(sb.ToString());
            }
        }

        public CommandResult<SoldCoupon> EditSoldCoupon(SoldCouponEditModel model)
        {
            // Update Sold Coupon.
            CheckDbConnect();
            var d = Context.SoldCoupons.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<SoldCoupon>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.SoldDate = DateTime.Now;
            d.BuyerName = model.BuyerName;
            d.Keyword = model.BuyerName.ToString();
            d.IsOnlineShop = model.IsOnlineShop;
            d.Status = model.Status;
            d.TotalPrice = model.TotalPrice;

            
                
                var detailreceiptlst1 = model.detailReceipts.ToList();
                for (int key = 0; key < detailreceiptlst1.Count; key++)
                {
                    if (detailreceiptlst1[key].Id == 0)
                    {
                        var tradeHistorie = new TradeHistorie
                        {

                            Status = 0,
                            Amount = detailreceiptlst1[key].Ammount,
                            ClothesId = detailreceiptlst1[key].ClothesId,
                            TradeTime = DateTime.Now
                        };
                        Context.TradeHistories.Add(tradeHistorie);
                        Context.SaveChanges();
                    }
                    else
                    {
                        var tradeHistorie1 = new TradeHistorie
                        {
                            Status = 0,
                            Amount = detailreceiptlst1[key].Ammount,
                            ClothesId = detailreceiptlst1[key].ClothesId,
                            TradeTime = DateTime.Now
                        };
                        Context.TradeHistories.Add(tradeHistorie1);
                        Context.SaveChanges();
                    }
                    



                }

                
            

            Context.SaveChanges();

            // Update Detail Receipt Rows.
            var detailreceiptlst = model.detailReceipts.ToList();
            for(int i = 0; i < detailreceiptlst.Count; i++)
            {
                // Add new detail receipt row.
                if(detailreceiptlst[i].Id == 0)
                {
                    var detailReceipt = new DetailReceipt
                    {
                        Id = detailreceiptlst[i].Id,
                        Status = detailreceiptlst[i].Status,
                        UnitMeasure = detailreceiptlst[i].UnitMeasure,
                        Ammount = detailreceiptlst[i].Ammount,
                        Price = detailreceiptlst[i].Price,
                        FinalPrice = detailreceiptlst[i].FinalPrice,
                        ClothesId = detailreceiptlst[i].ClothesId,
                        CouponId = d.Id
                    };
                    Context.DetailReceipts.Add(detailReceipt);
                    Context.SaveChanges();
                }
                else
                {
                    // Update detail receipt row
                    var detailJson = model.detailReceipts[i].Id;
                    var detail = Context.DetailReceipts.FirstOrDefault(x => x.Id == detailJson);
                    if (detail == null)
                        return new CommandResult<SoldCoupon>("No result!");
                    detail.Status = detailreceiptlst[i].Status;
                    detail.UnitMeasure = detailreceiptlst[i].UnitMeasure;
                    detail.ClothesId = detailreceiptlst[i].ClothesId;
                    
                    detail.CouponId = d.Id;
                    detail.Price = detailreceiptlst[i].Price;
                    detail.FinalPrice = detailreceiptlst[i].FinalPrice;
                    
                    
                }   
            }

            

            Context.SaveChanges();
            



            return new CommandResult<SoldCoupon>(d);
        }


        //Delete both Sold Coupon and Detail Receipt list.
        public void DeleteSoldCouponByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update SoldCoupons set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id in ('" + idStr + "')");
            Context.Database.ExecuteSqlCommand(

                "UPDATE DetailReceipts set Status = -1 WHERE CouponId in ('" + idStr + "')"
                
              );
                
        }

        /*public CommandResult<SoldCoupon> DeleteEachReceiptRows(SoldCouponEditModel model)
        {
            CheckDbConnect();
            

            Context.SaveChanges();
            return new CommandResult<SoldCoupon>("Delete successfully!");
        }*/
       /* public bool UpdateBrandStatus(int id, int status)
        {
            CheckDbConnect();
            var m = Context.Students.FirstOrDefault(x => x.Id == id);
            if (m == null)
                return false;

            m.Status = status;
            Context.SaveChanges();
             
            return true;
        }*/
         
    }
}