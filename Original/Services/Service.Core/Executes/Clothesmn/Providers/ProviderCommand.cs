using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Clothes;
using Service.Education.Executes.Clothesmn.Providers;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Provider> CreateProvider(ProviderEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new Provider
                {
                    Id = model.Id,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.UpdatedBy,
                    CreatedBy = model.UpdatedBy,
                    Keyword = model.Name,
                    Name = model.Name,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address,
                    Status = model.Status,
                    Country = model.Country
                };
               
                
                Context.Providers.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<Provider>(d);
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
                return new CommandResult<Provider>(sb.ToString());
            }
        }
        public CommandResult<Provider> EditProvider(ProviderEditModel model)
        {
            CheckDbConnect();
            var d = Context.Providers.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<Provider>("No result!");

            var notes = new List<string>()
            {

            };
            d.Name = model.Name;
            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.CreatedBy = model.UpdatedBy;
            d.Address = model.Address;
            d.Country = model.Country;
            d.Status = model.Status;
            d.PhoneNumber = model.PhoneNumber;




            Context.SaveChanges();

            return new CommandResult<Provider>(d);
        }

        public void DeleteProviderByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update Providers set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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