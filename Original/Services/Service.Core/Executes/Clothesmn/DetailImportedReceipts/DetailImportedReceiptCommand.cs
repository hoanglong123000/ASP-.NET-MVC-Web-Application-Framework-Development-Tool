using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.DetailImportedReceipts;
using System.Data;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        // Add Chi Tiet.
        public CommandResult<DetailImportedReceipt> CreateDetailImportedReceipt(DetailImportedReceiptEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new DetailImportedReceipt
                {
                    Id = model.Id,
                    Status = model.Status,
                    ClothesId = model.ClothesId,
                    UnitMeasure = model.UnitMeasure,
                    Amount = model.Amount,
                    Price = model.Price,
                    FinalPrice = model.FinalPrice,
                    CouponId = model.CouponId
                              
                };
               
                
                Context.DetailImportedReceipts.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<DetailImportedReceipt>(d);
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
                return new CommandResult<DetailImportedReceipt>(sb.ToString());
            }
        }
        public CommandResult<DetailImportedReceipt> EditDetailImportedReceipt(DetailImportedReceiptEditModel model) 
        {
            CheckDbConnect();
            var d = Context.DetailImportedReceipts.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<DetailImportedReceipt>("No result");

            var notes = new List<string>()
            {

            };

            d.Status = model.Status;
            d.UnitMeasure = model.UnitMeasure;
            d.Price = model.Price;
            d.FinalPrice = model.FinalPrice;
            d.Amount = model.Amount;
            d.ClothesId = model.ClothesId;
            d.CouponId = model.CouponId;
            d.Keyword = model.ClothesId.ToString();

            
            
           
            Context.SaveChanges();

            return new CommandResult<DetailImportedReceipt>(d);
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