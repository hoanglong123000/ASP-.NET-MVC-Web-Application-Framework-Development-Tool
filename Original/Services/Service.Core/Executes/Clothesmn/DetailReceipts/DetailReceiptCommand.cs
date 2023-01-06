using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.DetailReceipts;
using System.Data;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        // Add Chi Tiet.
        public CommandResult<DetailReceipt> CreateDetailReceipt(DetailReceiptEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new DetailReceipt
                {
                    Id = model.Id,
                    Status = model.Status,
                    ClothesId = model.ClothesId,
                    UnitMeasure = model.UnitMeasure,
                    Ammount = model.Ammount,
                    Price = model.Price,
                    FinalPrice = model.FinalPrice,
                    CouponId = model.CouponId
                              
                };
               
                
                Context.DetailReceipts.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<DetailReceipt>(d);
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
                return new CommandResult<DetailReceipt>(sb.ToString());
            }
        }
        public CommandResult<DetailReceipt> EditDetailReceipt(DetailReceiptEditModel model) 
        {
            CheckDbConnect();
            var d = Context.DetailReceipts.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<DetailReceipt>("No result");

            var notes = new List<string>()
            {

            };

            d.Status = model.Status;
            d.UnitMeasure = model.UnitMeasure;
            d.Price = model.Price;
            d.FinalPrice = model.FinalPrice;
            d.Ammount = model.Ammount;
            d.ClothesId = model.ClothesId;
            d.CouponId = model.CouponId;
            d.Keyword = model.ClothesId.ToString();

            
            
           
            Context.SaveChanges();

            return new CommandResult<DetailReceipt>(d);
        }

       /* public void DeleteDetailReceiptByIds(List<int> ids)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update DetailReceipts set Status = -1 '" +
                "where Id in ('" + idStr + "')"); 
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