
using Service.Utility.Components;
using Service.BCT.Executes.Employees.EmployeeOrganizations;
using System;
using System.Linq;
using DBContext.BCT.Entities;
using Service.Utility.Variables;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {

        public CommandResult<EmployeeOrganization> WorkTransfer(EmployeeOrganizationEditModel model)
        { 
            CheckDbConnect();  
            if (model.OldOrganizationId.HasValue)
            {
                var wp = Context.EmployeeWorkProcesses.FirstOrDefault(x =>
                    x.OrganizationId == model.OldOrganizationId.Value
                    && x.EmployeeId == model.EmployeeId
                    && x.EndDate == null);

                if (wp != null)
                {
                    wp.DonVi_Cu = model.OldOrganizationId;
                    wp.ViTri_Cu = model.OldJobPositionId;
                    wp.EndDate = DateTime.Now;
                    wp.Comment = model.Comment;
                    Context.SaveChanges();
                }
                var eo = Context.EmployeeOrganizations.FirstOrDefault(x =>
                    x.OrganizationId == model.OldOrganizationId.Value
                    && x.EmployeeId == model.EmployeeId);
                if (eo != null)
                {
                    Context.EmployeeOrganizations.Remove(eo);
                    Context.SaveChanges();
                }
            }
            else
            {
                // kiem tra va xoa vi tri cong khac khong phai kiem nhiem
                var othereo = Context.EmployeeOrganizations.Where(x => !x.Concurrently
                                                                       && x.EmployeeId == model.EmployeeId &&
                                                                       x.OrganizationId != model.OrganizationId)
                    .ToList();
                if (othereo.Any())
                {
                    Context.EmployeeOrganizations.RemoveRange(othereo);
                    Context.SaveChanges();
                }
            }
            var org = Context.Organizations.FirstOrDefault(x => x.Id == model.OrganizationId);

            var idStr = "";
            if (org != null)
            {
                if (org.ParentStr.HasValue())
                {
                    idStr = org.ParentStr + org.Id + ";";
                }
                else
                {
                    idStr = ";" + org.Id + ";";
                }

                Context.EmployeeOrganizations.Add(new EmployeeOrganization()
                {
                    EmployeeId = model.EmployeeId,
                    OrganizationId = model.OrganizationId,
                    Organizations = idStr,
                    JobPositionId = model.JobPositionId,
                    OrgLevel = org.OrgLevelId,
                    UpdatedBy = model.UpdatedBy,
                    UpdatedDate = DateTime.Now
                });
                Context.SaveChanges();

            }


            var ep = new EmployeeWorkProcess()
            {
                EmployeeId = model.EmployeeId,
                OrganizationId = model.OrganizationId,
                JobPositionId = model.JobPositionId,
                Concurrently = model.Concurrently,
                QuyetDinh_So = model.QuyetDinh_So,
                StartDate = DateTime.Now,
                CreatedBy = model.UpdatedBy,
                CreatedDate = DateTime.Now,
                UpdatedBy = model.UpdatedBy,
                UpdatedDate = DateTime.Now,
            };
            var owner = GetOwner(model.OrganizationId, model.JobPositionId);
            if (owner != null)
            {
                ep.OwnerId = owner.Id;
            }
            Context.EmployeeWorkProcesses.Add(ep);
            Context.SaveChanges();

            Caching.Delete("EmployeeOrganization", "users");

            return new CommandResult<EmployeeOrganization>(true);
        }

        public CommandResult<object> EndWordProcess(EmployeeOrganizationEditModel model)
        {
            CheckDbConnect();

            var wp = Context.EmployeeWorkProcesses.FirstOrDefault(x => x.EmployeeId == model.EmployeeId
                                                                       && x.OrganizationId == model.OrganizationId
                                                                       && x.JobPositionId == model.JobPositionId
                                                                       && x.Concurrently == model.Concurrently
                                                                       && x.EndDate == null);
            if (wp != null)
            {
                var owner = GetOwner(model.OrganizationId, model.JobPositionId);
                if (owner != null)
                {
                    if (owner.Id != model.EmployeeId)
                    {
                        wp.OwnerId = owner.Id;
                    }
                    else
                    {
                        wp.OwnerId = null;
                    }
                    
                }

                wp.EndDate = DateTime.Now;
                wp.Comment = model.Comment;
                Context.SaveChanges();

                
            }
            var eo = Context.EmployeeOrganizations.FirstOrDefault(x =>
                x.EmployeeId == model.EmployeeId && x.OrganizationId == model.OrganizationId &&
                x.JobPositionId == model.JobPositionId);

            if (eo != null)
            {
                Context.EmployeeOrganizations.Remove(eo);
                Context.SaveChanges();
            }

            

            return new CommandResult<object>(true);
        }

        public CommandResult<object> StartWordProcess(EmployeeOrganizationEditModel model)
        {
            CheckDbConnect();
            var owner = GetOwner(model.OrganizationId, model.JobPositionId);

            var wp = new EmployeeWorkProcess()
            {
                EmployeeId = model.EmployeeId,
                OrganizationId = model.OrganizationId,
                JobPositionId = model.JobPositionId,
                StartDate = DateTime.Now,
                QuyetDinh_So = model.QuyetDinh_So,
                Concurrently = model.Concurrently,
                CreatedDate = DateTime.Now,
                CreatedBy = model.UpdatedBy,
                UpdatedBy = model.UpdatedBy,
                UpdatedDate = DateTime.Now
            };
            if (owner != null)
            {
                if (owner.Id != model.EmployeeId)
                {
                    wp.OwnerId = owner.Id;
                }
                else
                {
                    wp.OwnerId = null;
                }
            }

            Context.EmployeeWorkProcesses.Add(wp);
            Context.SaveChanges();

            return new CommandResult<object>(true);
        }



        public void DeleteEmployeeOrganization(int id)
        {
            CheckDbConnect();
            var l = Context.EmployeeOrganizations.FirstOrDefault(x => x.Id == id);
            if (l != null)
            {
                l.Status = -1;
                Context.SaveChanges();
                LogDelete("xóa quan hệ gia đình", "EmployeeOrganization", l.Id.ToString());
            }
        }
    }
}
