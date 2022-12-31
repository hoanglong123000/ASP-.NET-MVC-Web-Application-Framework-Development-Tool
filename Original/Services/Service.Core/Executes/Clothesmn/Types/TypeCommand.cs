using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.TypeClothes;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<TypeClothe> CreateTypeClothe(TypeClotheEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new TypeClothe
                {
                    Id = model.Id,
                    NameofType = model.NameofType,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                };
               
                
                Context.TypeClothes.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<TypeClothe>(d);
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
                return new CommandResult<TypeClothe>(sb.ToString());
            }
        }
        public CommandResult<TypeClothe> EditTypeClothe(TypeClotheEditModel model)
        {
            CheckDbConnect();
            var d = Context.TypeClothes.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<TypeClothe>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.NameofType = model.NameofType;

            Context.SaveChanges();
             
            return new CommandResult<TypeClothe>(d);
        }

        public void DeleteTypeClothesByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update TypeClothes set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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