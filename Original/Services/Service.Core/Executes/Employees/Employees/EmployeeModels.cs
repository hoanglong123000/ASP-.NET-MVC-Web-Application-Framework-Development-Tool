
using Service.Education.Executes.Employees.EmployeeAuths; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DBServer.Entities;
using Service.Utility.Components;

namespace Service.Education.Executes.Employees.Employees
{
    public class EmployeeViewModel : Employee
    { 
        public EmployeeAuthViewModel EmployeeAuth { get; set; } 
    }
     

    public class EmployeeExportViewModel : Employee
    {
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public int? NoiDaoTao { get; set; }
        public Nullable<System.DateTime> CMND_NgayCap { get; set; }
        public int? CMND_NoiCap { get; set; }
        public double? ChieuCao { get; set; }
        public double? CanNang { get; set; }
        public int? DanToc { get; set; }
        public int? TonGiao { get; set; }
        public int? VungMien { get; set; }
        public int? QuocTich { get; set; }
        public string Skype { get; set; }
        public string SoHopDong { get; set; }
        public string Facebook { get; set; }
        public int SoNamKinhNghiem { get; set; }
        public string ThuongTru_Duong { get; set; }
        public int? ThuongTru_Quan { get; set; }
        public int? ThuongTru_Tinh { get; set; }
        public int? ThuongTru_Phuong { get; set; }
        public string TamTru_Duong { get; set; }
        public int? TamTru_Quan { get; set; }
        public int? TamTru_Tinh { get; set; }
        public int? TamTru_Phuong { get; set; }
        public string QueQuan_Duong { get; set; }
        public int? QueQuan_Quan { get; set; }
        public int? QueQuan_Tinh { get; set; }
        public int? QueQuan_Phuong { get; set; }
        public string MST { get; set; }
        public string TKNH_So { get; set; }
        public string TKNH_NganHang { get; set; }
        public string TKNH_ChiNhanh { get; set; }
        public string MaChamCong { get; set; }
        public bool? ThamGiaCongDoan { get; set; }
        public int? SoNgayPhep { get; set; }
        public bool? TuDongTangPhep { get; set; }
        public string BHXH_So { get; set; }
        public int? BHXH_TinhTrang { get; set; }
        public string SoThich { get; set; }
        public string DiemManh { get; set; }
        public string DiemYeu { get; set; }
        public string DinhHuongNgheNghiep { get; set; }
        public string KyNangThamGiaTinhNguyen { get; set; }
        public int? NoiTuyenDung { get; set; }
        public int? CaLamViec { get; set; }
        public string SoTruong { get; set; }
        public string SoDoan { get; set; }
        public DateTime? NamBatDauDiLam { get; set; }
        public int? XepLoaiTotNghiep { get; set; }
        public int? NamTotNghiep { get; set; }
        public string LHK_HoTen { get; set; }
        public string LHK_DienThoai { get; set; }
        public string TinhTrangNhaO { get; set; }
        public string PhuongTienDiLai { get; set; }
        public string NgoaiNgu1_Ten { get; set; }
        public string NgoaiNgu1_TrinhDo { get; set; }
        public string NgoaiNgu2_Ten { get; set; }
        public string NgoaiNgu2_TrinhDo { get; set; }
        public string NgoaiNgu3_Ten { get; set; }
        public string NgoaiNgu3_TrinhDo { get; set; }
        public string NgoaiNgu4_Ten { get; set; }
        public Guid? OwnerId { get; set; }

        public string NgoaiNgu4_TrinhDo { get; set; }
        public DateTime? TG_Tu { get; set; }
        public DateTime? TG_Den { get; set; }
        public System.DateTime? NgayHieuLucHD { get; set; }
        public string ThuongTru_Address { get; set; }
        public string QueQuan_Address { get; set; }
        public string TamTru_Address { get; set; } 
        public int SoLanKyHD { get; set; }
        public int? OrganizationId { get; set; }
        public int? JobPositionId { get; set; }
        public int? JobTitleId { get; set; }
        public int? KhuVucDonVi { get; set; }
        public decimal? MucLuong { get; set; }
        public bool WorkIndirectly { get; set; }
        public string KCB_MaBV { get; set; }
        public string KCB_MaTinh { get; set; }
        public string CH_HoTen { get; set; }
        public string CH_NgaySinh { get; set; }
        public bool CH_Nu { get; set; }
        public int? CH_KS_Tinh { get; set; }
        public int? CH_KS_Quan { get; set; }
        public int? CH_KS_Phuong { get; set; }
        public int? CH_QuanHe { get; set; }
        public string CH_DienThoai { get; set; }
        public string CH_SoHK { get; set; }
    }
    public class EmployeeEditModel : Employee
    {
        public HttpPostedFileBase AvatarPostFileBase { get; set; }
        public string LoginName { get; set; }
        public string Perform { get; set; }
        public string Form { get; set; }
        public bool LockoutEnabled { get; set; }
        public int Role { get; set; }
        public int Tab { get; set; }
        public bool SystemEmployee { get; set; }
        public string MessageType { get; set; }
        public string Message { get; set; }
        public bool SendEmail { get; set; }
        public bool RandomPassword { get; set; }
        public string EmailPassword { get; set; }
        public int CustomerType { get; set; }
        public string Tax { get; set; }
        public string Password { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool SendMailChangePassword { get; set; }
        public DateTime? CMND_NgayCap { get; set; }
        public int? CMND_NoiCap { get; set; }
        public double? ChieuCao { get; set; }
        public double? CanNang { get; set; }
        public int? DanToc { get; set; }
        public int? TonGiao { get; set; }
        public int? QuocTich { get; set; }
        public string Skype { get; set; }
        public string Facebook { get; set; }
        public int? NoiDaoTao { get; set; }
        public int? ThuongTru_Tinh { get; set; }
        public int? ThuongTru_Quan { get; set; }
        public string ThuongTru_Duong { get; set; }
        public int? ThuongTru_Phuong { get; set; }
        public int? QueQuan_Tinh { get; set; }
        public int? QueQuan_Quan { get; set; }
        public string QueQuan_Duong { get; set; }
        public int? QueQuan_Phuong { get; set; }
        public int? TamTru_Tinh { get; set; }
        public int? TamTru_Quan { get; set; }
        public int? TamTru_Phuong { get; set; }
        public string TamTru_Duong { get; set; }
        public string MST { get; set; }
        public string TKNH_So { get; set; }
        public string TKNH_NganHang { get; set; }
        public string TKNH_ChiNhanh { get; set; }
        public string MaChamCong { get; set; }
        public int? NghiViec_LyDo { get; set; }
        public DateTime? NghiViec_NgayNghi { get; set; }
        public Guid? NghiViec_NguoiDuyet { get; set; }
        public DateTime? NghiViec_NgayBDLamThuTuc { get; set; }
        public bool? ThamGiaCongDoan { get; set; }
        public int? SoNgayPhep { get; set; }
        public bool? TuDongTangPhep { get; set; }
        public string BHXH_So { get; set; }
        public int? BHXH_TinhTrang { get; set; }
        public DateTime? NamBatDauDiLam { get; set; }
        public int? DKKCB_NoiDK { get; set; }
        public DateTime? DKKCB_NgayHetHan { get; set; }
        public string SoThich { get; set; }
        public string DiemManh { get; set; }
        public string DiemYeu { get; set; }
        public string DinhHuongNgheNghiep { get; set; }
        public string KyNangThamGiaTinhNguyen { get; set; }
        public string Groups { get; set; }
        public string SoTruong { get; set; }
        public string SoDoan { get; set; }
        public string DiemGoc { get; set; }
        public int? NamTotNghiep { get; set; }
        public string LHK_HoTen { get; set; }
        public string LHK_DienThoai { get; set; }
        public string TinhTrangNhaO { get; set; }
        public string PhuongTienDiLai { get; set; }
        public string NgoaiNgu1_Ten { get; set; }
        public string NgoaiNgu1_TrinhDo { get; set; }
        public string NgoaiNgu2_Ten { get; set; }
        public string NgoaiNgu2_TrinhDo { get; set; }
        public string NgoaiNgu3_Ten { get; set; }
        public string NgoaiNgu3_TrinhDo { get; set; }
        public string NgoaiNgu4_Ten { get; set; }
        public string NgoaiNgu4_TrinhDo { get; set; }
        public int? NoiTuyenDung { get; set; }
        public int? VungMien { get; set; }
    }

    public class EmployeeDetailsummaryInfo
    {
        public int Id { get; set; }
        public string JobPosition { get; set; }
        public string FullName { get; set; }
        public int Media { get; set; }
        public string Code { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Facebook { get; set; }
        public string Address { get; set; }
    }
    public class SearchEmployeeModel
    {
        public string Keyword { get; set; }
        public bool Suggestion { get; set; }
        public string Perform { get; set; }
        public bool? WorkIndirectly { get; set; }
        public int? KhuVucDonVi { get; set; }
        public int? VungMien { get; set; }
        public Guid? Id { get; set; }
        public bool? IncludeDeleted { get; set; }
        public bool HasDetail { get; set; }
        public bool? SummaryInfo { get; set; }
        public DateTime? NgayVaoCongTyFrom { get; set; }
        public DateTime? NgayVaoCongTyTo { get; set; }
        public DateTime? BirthdateFrom { get; set; }
        public DateTime? BirthdateTo { get; set; }
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public bool HasAdmin { get; set; }
        public int? HinhThucDaoTao { get; set; }
        public List<Guid> Ids { get; set; }
        public bool? MEP { get; set; }
        public string IdStr { get; set; }
        public bool HasOrg { get; set; }
        public bool HasOwner { get; set; }
        public List<string> CodeList { get; set; }
        public int? StoreId { get; set; }
        public string Email { get; set; }
        public string StaffCode { get; set; }
        public string EmailCongTy { get; set; }
        public string CMND { get; set; }
        public int? GioiTinh { get; set; }
        public ObjectStatus? Status { get; set; }
        public string UserName { get; set; }
        public string TempValue { get; set; }
        public bool? IncludeLocked { get; set; }
        public Guid? NotId { get; set; }
        public int? OrganizationId { get; set; }
        public string OrgStr { get; set; }
        public bool? Concurrently { get; set; }
        public bool PrivateCount { get; set; }
        public bool HasAuth { get; set; }
        public int? JobPositionId { get; set; }
        public List<int> JobPositions { get; set; }
        public int? BangDaiHoc { get; set; }
        public int? ThamNienFrom { get; set; }
        public int? ThamNienTo { get; set; }
        public string JobTitles { get; set; }
        public string JobTitle { get; set; }
        public string JobTitleCode { get; set; }
        public string GroupTitleStr { get; set; }
        public string DiDong { get; set; }
        public int? TrinhDoDaoTao { get; set; }
        public string TrinhDoDaoTaoStr { get; set; }
        public int? TruongHoc { get; set; }
        public int? ChuyenNganh { get; set; }
        public DateTime? NgayThuViecFrom { get; set; }
        public DateTime? NgayThuViecTo { get; set; }
        public DateTime? NgayChinhThucFrom { get; set; }
        public DateTime? NgayChinhThucTo { get; set; }
        public string NgayVaoLamFromStr { get; set; }
        public string NgayVaoLamToStr { get; set; }
        public int? LoaiHopDong { get; set; }
        public int? TrangThaiCongViec { get; set; }
        public string TrangThaiCongViecStr { get; set; }
        public int? Year { get; set; }
        public int? AgeFrom { get; set; }
        public int? AgeTo { get; set; }
        public Guid? QuanLy { get; set; }
        public int? LoaiQuanLy { get; set; }
        public string SidebarActionView { get; set; }
        public int? OrgIdOrHeadCount { get; set; }
        public int? ThangSinh { get; set; }
        public string FeatureCode { get; set; }
        public bool? AllowApproval { get; set; }
        public int? OrgLevelId { get; set; }
        public int? NoiSinh { get; set; }
        public int? TonGiao { get; set; }
        public int? DanToc { get; set; }
        public int? TinhTrangHonNhan { get; set; }
        public int? DiemGoc { get; set; }
        public int? BacLD { get; set; }
        public int? BacLDTu { get; set; }
        public int? BacLDDen { get; set; }
        public string ColStr { get; set; }
        public int? NoiTuyenDung { get; set; }

        public int? TamTru_Tinh { get; set; }
        public int? TamTru_Quan { get; set; }
        public int? ThuongTru_Tinh { get; set; }
        public int? ThuongTru_Quan { get; set; }
        public int? QueQuan_Tinh { get; set; }
        public int? QueQuan_Quan { get; set; }
        public int? TamTru_Phuong { get; set; }
        public int? ThuongTru_Phuong { get; set; }
        public int? QueQuan_Phuong { get; set; }
    }

    public class NhanSuTheoDoDuoi
    {
        public int DoTuoi { get; set; }
        public int Nam { get; set; }
        public int Nu { get; set; }
    }

    public class NhanSuTheoSinhNhat : EmployeeSuggestion
    { 

        public string TKNH_So { get; set; }
        public string TKNH_NganHang { get; set; }
        public string TKNH_ChiNhanh { get; set; }
    }
    public class NhanSuTheoBangDaiHoc
    {
        public string TenBang { get; set; }
        public int SoLuong { get; set; }
    }

    public class SearchProbationaryEmployeeModel
    {
        public bool? HDTV { get; set; }
        public int? CandidateId { get; set; }
        public int? StageCandidateId { get; set; }
    }

    public class ProbationaryEmployeeViewModel
    {
        public int Id { get; set; }
        public bool HDTV { get; set; }
        public int? JobPositionId { get; set; } 
        public int? ContractLaborId { get; set; }
        public Guid? EmployeeId { get; set; }
        public EmployeeSuggestion ObjEmployee { get; set; }
        public decimal? LuongThuViec { get; set; }
        public decimal? LuongChinhThuc { get; set; }
        public int? ThoiGianThuViec { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public int? BoPhanTiepNhan { get; set; }
        public int? DiemGoc { get; set; } 
    }

    public class EmpBaseItem
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
    public class EmployeeSuggestion : Employee
    {
        public int? OrganizationId { get; set; } 
        public int? JobPositionId { get; set; }
        public int? JobTitleId { get; set; }
        public string JobTitleCode { get; set; } 
        public int? CountRow { get; set; }
        public EmployeeAuthViewModel Auth { get; set; }
         
        public EmployeeSuggestion Owner { get; set; }
         

    }

    public class NewEmployeeViewModel
    {
        public Guid Id { get; set; }
        public string StaffCode { get; set; }
        public string FullName { get; set; }
        public int? JobPositionId { get; set; }
        public int? OrganizationId { get; set; }
        public string EmailCongTy { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string Avatar { get; set; }
        public DateTime? NgayVaoCongTy { get; set; }
        public int? TrinhDoDaoTao { get; set; }
         
    }
    public class TTCVModel
    {
        public int TrangThai { get; set; }
        public int Total { get; set; }
    }


    public class EmployeesForManeuveModel
    {
        public Guid Id { get; set; }
        public string StaffCode { get; set; }
        public string FullName { get; set; }
        public DateTime NgaySinh { get; set; }
        public int? ChuyenNganh { get; set; }
        public int? OrganizationId { get; set; }
        public string Avatar { get; set; }
        public int? JobPositionId { get; set; }
         
        public DateTime? NamBatDauDiLam { get; set; }
        public DateTime? NgayVaoCongTy { get; set; }
        public string DiDong { get; set; }
        public string EmailCongTy { get; set; }
        public string ThamNien
        {
            get
            {
                if (NgayVaoCongTy.HasValue)
                {
                    return NgayVaoCongTy.Seniority("y");
                }

                return "0";
            }
        }
        public string SoNamKinhNghiem
        {
            get
            {
                if (NamBatDauDiLam.HasValue)
                {
                    return NamBatDauDiLam.Seniority("y");
                }

                return "0";
            }
        }
    }
}