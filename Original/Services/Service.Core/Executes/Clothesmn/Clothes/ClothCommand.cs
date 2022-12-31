using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.Clothes;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Cloth> CreateCloth(ClothEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new Cloth
                {
                    Id = model.Id,
                    Name = model.Name,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                    SizeId = model.SizeId,
                    BrandId = model.BrandId,
                    TypeId = model.TypeId,
                    Keyword = model.Name
                };
               
                
                Context.Clothes.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<Cloth>(d);
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
                return new CommandResult<Cloth>(sb.ToString());
            }
        }
        public CommandResult<Cloth> EditCloth(ClothEditModel model)
        {
            CheckDbConnect();
            var d = Context.Clothes.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<Cloth>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.Name = model.Name;
            d.SizeId = model.SizeId;
            d.BrandId = model.BrandId;
            d.TypeId = model.TypeId;
            d.Keyword = model.Name;

            Context.SaveChanges();

            return new CommandResult<Cloth>(d);
        }

        public void DeleteClothByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update Clothes set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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