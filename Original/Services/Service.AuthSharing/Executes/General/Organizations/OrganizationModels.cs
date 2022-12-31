
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.Employees.Employees;
using DBContext.Core.Entities;

namespace Service.AuthSharing.Executes.General.LocalOrganizations
{
    public class SearchLocalOrganizationModel
    {
        public string Keyword { get; set; }
        public bool Cache { get; set; }
        public int? Status { get; set; }
        public int? ParentId { get; set; }
        public string PriorityPosition { get; set; }
        public int? NearId { get; set; }
        public int? Type { get; set; }
        public List<int> Ids { get; set; }
        public int? LoaiHinhDuAn { get; set; }
        public Guid? UserId { get; set; }
        public Guid? Owner { get; set; }
        public Guid? QuanLy { get; set; }
        public int? Id { get; set; }
        public bool? Stopped { get; set; }
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public int? PositionType { get; set; }
        public Guid? EmployeePositionId { get; set; }
        public bool HasSummary { get; set; }
        public bool HasOwner { get; set; }
        public bool HasSecretary { get; set; }
        public bool HasStopped { get; set; }
        public bool HasIndirectManagers { get; set; }
    }

    public class LocalOrganizationViewModel : LocalOrganization
    { 
        public BaseItem ObjLoaiBoPhan { get; set; }
        public BaseItem ObjKhuVuc { get; set; }
        public EmployeeBaseView ObjOwner { get; set; }
        public EmployeeBaseView ObjInOwner1 { get; set; }
        public EmployeeBaseView ObjInOwner2 { get; set; }
        public EmployeeBaseView ObjInOwner3 { get; set; }
        public EmployeeBaseView ObjInOwner4 { get; set; }

        public EmployeeBaseView ObjCreatedBy { get; set; }
        public EmployeeBaseView ObjUpdatedBy { get; set; }
    }

    public class LocalOrganizationEditModel : LocalOrganization
    {
        public bool Send { get; set; }
    }


    public class LocalOrganizationManagerViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Type { get; set; }
        public EmployeeBaseView Owner { get; set; }
        public Guid? OwnerId { get; set; }
        public string IndirectManagers { get; set; }
        public List<EmployeeBaseView> ListIndirectManagers { get; set; }
    }
    public class LocalOrganizationSummary
    {
        public int Id { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string ParentStr { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public Nullable<int> DirectManager { get; set; }
        public string IndirectManagers { get; set; }
        public Nullable<System.Guid> ConcurrentlyManager { get; set; }
        public int Type { get; set; }
        public int OrgLevelId { get; set; }
        public Nullable<System.DateTime> TGTC_Tu { get; set; }
        public Nullable<System.DateTime> TGTC_Den { get; set; }
        public bool Stopped { get; set; }
        public int Status { get; set; }
        public int? CongTyTinhLuong { get; set; }
    }
}
