using System.Collections.Generic;
using System.Web.Mvc;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using Service.Core.Executes.Email;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.General.LocalEmailTemplates
{
	public class LocalEmailTemplateEditModel : LocalEmailTemplate
	{
		[AllowHtml]
		public string DetailStr { get; set; }
		public List<LocalEmailTemplateCodeEditModel> Codes { get; set; }
		public string Attr { get; set; }
		public string Value { get; set; }
	}

	public class LocalEmailTemplateViewModel : LocalEmailTemplate
	{
		public List<BaseItem> AttributeList { get; set; }
		public string ProcessCode { get; set; }
		public string ProcessName { get; set; }
		public string ModuleCode { get; set; }

	}

	public class SearchLocalEmailTemplateModel
	{
		public string ProcessKeyword { get; set; }
		public string ModuleCode { get; set; }
		public int? ProcessId { get; set; }
		public bool? IsDefault { get; set; }
		public string Keyword { get; set; }
		public int? Cap { get; set; }
		public int? Type { get; set; }
		public int? BuocDuyet { get; set; }
		public int? TrangThaiPheDuyet { get; set; }
		public string Code { get; set; }
		public bool? Comment { get; set; }

	}

	public class SearchLocalEmailTemplateCodeModel
	{
		public bool Cache { get; set; }
		public int? TemplateId { get; set; }
	}

	public class LocalEmailTemplateCodeViewModel : EmailTemplateCode
	{
	}

	public class LocalEmailTemplateCodeEditModel : EmailTemplateCode
	{
		//Columns
		public bool IsDelete { get; set; }
	}

	public class LocalEmailTemplateRenderAttribute
	{
		public string HoTenNguoiNhan { get; set; }
		public string AnhDaiDien { get; set; }
		public string BoPhan { get; set; }
		public string BoPhanChuyenTra { get; set; }
		public string BoPhanHienTai { get; set; }
		public string BoPhanMoi { get; set; }
		public string ChuyenMon { get; set; }
		public string Deadline { get; set; }
		public string DiaDiem { get; set; }
		public string DiaDiemPhongVan { get; set; }
		public string DienThoai { get; set; }
		public string DonViDaoTao { get; set; }
		public string Email { get; set; }
		public string GhiChu { get; set; }
		public string GiangVien { get; set; }
		public string GioPhongVan { get; set; }
		public string HocVien_BoPhan { get; set; }
		public string HocVien_HoTen { get; set; }
		public string HocVien_MSNV { get; set; }
		public string HocVien_ViTriCongTac { get; set; }
		public string HoTen { get; set; }
		public string HoTenCacNhanSuDuocDieuDong { get; set; }
		public string HoTenNguoiDuyet { get; set; }
		public string HoTenNguoiNhanEmail { get; set; }
		public string HoTenNguoiPheDuyet { get; set; }
		public string HoTenNhanSu { get; set; }
		public string HoTenQuanLyTrucTiep { get; set; }
		public string HoTenUngVien { get; set; }
		public string KinhNghiem { get; set; }
		public string LienLac_BoPhan { get; set; }
		public string LienLac_DienThoai { get; set; }
		public string LienLac_Email { get; set; }
		public string LienLac_GhiChu { get; set; }
		public string LienLac_HoTen { get; set; }
		public string LienLac_ViTriCongTac { get; set; }
		public string Link { get; set; }
		public string LyDoKhongDuyet { get; set; }
		public string MucLuong { get; set; }
		public string Nam { get; set; }
		public string NamSinh { get; set; }
		public string NgayDieuDong { get; set; }
		public string NgayPhongVan { get; set; }
		public string Quy { get; set; }
		public string STT { get; set; }
		public string TenBoPhan { get; set; }
		public string TenChucDanh { get; set; }
		public string TenChuongTrinh { get; set; }
		public string ThamNien { get; set; }
		public string Thang { get; set; }
		public string ThoiGianChuyenTra { get; set; }
		public string ThoiGianKhaiGiang { get; set; }
		public string ThoiHanKhaoSat { get; set; }
		public string ViTriCongTac { get; set; }
		public string ViTriHienTai { get; set; }
		public string ViTriMoi { get; set; }
		public string ViTriUngTuyen { get; set; }
	}

	public class LocalEmailTemplateHtmlRenderModel
	{
		public string Html { get; set; }
		public bool NotImg { get; set; }
		public List<AlternateViewModel> Alternates { get; set; }
	}

	public class EmailAttributeItem
	{
		public string Attr { get; set; }
		public string Val { get; set; }
	}

	public class TestLocalEmailTemplateModel
	{
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Receivers { get; set; }
		public string CCs { get; set; }
		public List<BaseItem> Codes { get; set; }
		public string Module { get; set; }
		[AllowHtml]
		public string BodyHtml { get; set; }

		public List<EmailAttributeItem> Attributes { get; set; }
	}
}
