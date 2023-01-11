using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Customers;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Customer> CreateCustomer(CustomerEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new Customer
                {
                    Id = model.Id,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                    Keyword = model.Name + model.PhoneNumber + model.Email,
                    Name = model.Name,
                    PhoneNumber = model.PhoneNumber,
                    Email = model.Email,
                    Address = model.Address
                };
               
                
                Context.Customers.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<Customer>(d);
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
                return new CommandResult<Customer>(sb.ToString());
            }
        }
        public CommandResult<Customer> EditCustomer(CustomerEditModel model)
        {
            CheckDbConnect();
            var d = Context.Customers.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<Customer>("No result!");

            var notes = new List<string>()
            {

            };

            

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.Name = model.Name;
            d.Keyword = model.Name + model.Email + model.PhoneNumber;
            d.PhoneNumber = model.PhoneNumber;
            d.Address = model.Address;
            d.Email = model.Email;
            Context.SaveChanges();

            return new CommandResult<Customer>(d);
        }

        public void DeleteCustomerByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update Customers set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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