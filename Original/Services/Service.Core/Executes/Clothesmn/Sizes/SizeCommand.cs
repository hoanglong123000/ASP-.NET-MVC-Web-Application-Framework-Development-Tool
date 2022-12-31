using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.SizeTabs;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<SizeTab> CreateSizeTab(SizeTabEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new SizeTab
                {
                    Id = model.Id,
                    NameofSize = model.NameofSize,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                };
               
                
                Context.SizeTabs.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<SizeTab>(d);
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
                return new CommandResult<SizeTab>(sb.ToString());
            }
        }
        public CommandResult<SizeTab> EditSizeTab(SizeTabEditModel model)
        {
            CheckDbConnect();
            var d = Context.SizeTabs.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<SizeTab>("No result!");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.NameofSize = model.NameofSize;

            Context.SaveChanges();
             
            return new CommandResult<SizeTab>(d);
        }

        public void DeleteSizeTabByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update SizeTabs set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
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