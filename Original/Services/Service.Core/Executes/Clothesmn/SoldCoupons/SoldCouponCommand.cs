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
                var d = new SoldCoupon
                {
                    Id = model.Id,

                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.UpdatedBy,
                    CreatedBy = model.CreatedBy,
                    SoldDate = DateTime.Now,
                    BuyerName = model.BuyerName,
                    PhoneNumber = model.PhoneNumber,
                    AddressBuyer = model.AddressBuyer,
                    IsOnlineShop = model.IsOnlineShop,
                    Status = model.Status,
                    TotalPrice = model.TotalPrice
                              
                };
               
                
                Context.SoldCoupons.Add(d);
                Context.SaveChanges();

                

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
            d.AddressBuyer = model.AddressBuyer;
            d.Keyword = model.BuyerName;
            d.PhoneNumber = model.PhoneNumber;
            d.IsOnlineShop = model.IsOnlineShop;
            d.Status = model.Status;
            d.TotalPrice = model.TotalPrice;

            
            
           
            Context.SaveChanges();

            return new CommandResult<SoldCoupon>(d);
        }

        public void DeleteSoldCouponByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update SoldCoupons set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id in ('" + idStr + "')"); 
        }
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