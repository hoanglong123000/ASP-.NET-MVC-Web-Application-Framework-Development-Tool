using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Brands;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Brand> CreateBrand(BrandEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new Brand
                {
                    Id = model.Id,
                    Name = model.Name,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                    Keyword = model.Name
                };
               
                
                Context.Brands.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<Brand>(d);
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
                return new CommandResult<Brand>(sb.ToString());
            }
        }
        public CommandResult<Brand> EditBrand(BrandEditModel model)
        {
            CheckDbConnect();
            var d = Context.Brands.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<Brand>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.Name = model.Name;
            d.Keyword = model.Name;

            Context.SaveChanges();
             
            return new CommandResult<Brand>(d);
        }

        public void DeleteBrandByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update Brands set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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