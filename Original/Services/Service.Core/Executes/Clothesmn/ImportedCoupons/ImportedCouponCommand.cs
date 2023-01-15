using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.ImportedCoupons;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<ImportedCoupon> CreateImportedCoupon(ImportedCouponEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new ImportedCoupon
                {
                    Id = model.Id,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                    Keyword = model.Keyword,
                    ImportedDate = model.ImportedDate,
                    ProviderId = model.ProviderId,
                    Note = model.Note,
                    TotalPrice  = model.TotalPrice
                };
               
                
                Context.ImportedCoupons.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<ImportedCoupon>(d);
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
                return new CommandResult<ImportedCoupon>(sb.ToString());
            }
        }
        public CommandResult<ImportedCoupon> EditImportedCoupon(ImportedCouponEditModel model)
        {
            CheckDbConnect();
            var d = Context.ImportedCoupons.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<ImportedCoupon>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.CreatedDate = model.CreatedDate;
            d.UpdatedBy = model.UpdatedBy;
            d.CreatedBy = model.CreatedBy;
            d.Keyword = model.Note;
            d.ImportedDate = model.ImportedDate;
            d.ProviderId = model.ProviderId;
            d.Note = model.Note;
            d.TotalPrice = model.TotalPrice;
            Context.SaveChanges();

            return new CommandResult<ImportedCoupon>(d);
        }

        public void DeleteImportedCouponByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update ImportedCoupons set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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