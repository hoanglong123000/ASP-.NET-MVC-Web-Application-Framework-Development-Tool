using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.Education.Executes.Educations.Students;
using DBServer.Entities;
using System.Data.Entity.Validation;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<Student> CreateStudent(StudentEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new Student
                {
                    Avatar = model.Avatar,
                    Name = model.Name,
                    Email = model.Email,
                    NgaySinh = model.NgaySinh,
                    GioiTinh = model.GioiTinh,
                    GroupId = model.GroupId,
                    MoTa = model.MoTa,
                    TomTat = model.TomTat.NewLineToBr(),
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = model.CreatedBy,
                    CreatedBy = model.CreatedBy,
                };
                d.Keyword = (d.Name + " " + d.Email).ToKeyword();
                d.MoTa = model.MoTaHtml;
                Context.Students.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<Student>(d);
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
                return new CommandResult<Student>(sb.ToString());
            }
        }
        public CommandResult<Student> EditStudent(StudentEditModel model)
        {
            CheckDbConnect();
            var d = Context.Students.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<Student>("Không tìm thấy thông tin TableTitle");

            var notes = new List<string>()
            {

            };

            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.Avatar = model.Avatar;
            d.Name = model.Name;
            d.Email = model.Email;
            d.NgaySinh = model.NgaySinh;
            d.GioiTinh = model.GioiTinh;
            d.GroupId = model.GroupId;
            d.MoTa = model.MoTaHtml;
            d.TomTat = model.TomTat.NewLineToBr();

            Context.SaveChanges();
             
            return new CommandResult<Student>(d);
        }

        public void DeleteStudentByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update Students set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")"); 
        }
        public bool UpdateStudentStatus(int id, int status)
        {
            CheckDbConnect();
            var m = Context.Students.FirstOrDefault(x => x.Id == id);
            if (m == null)
                return false;

            m.Status = status;
            Context.SaveChanges();
             
            return true;
        }
         
    }
}