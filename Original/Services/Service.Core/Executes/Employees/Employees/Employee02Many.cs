  
using Service.Education.Executes.Employees.Employees; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using DBServer.Entities;
using Service.Utility.Components;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public List<EmployeeExportViewModel> EmployeeForExport(SearchEmployeeModel model)
        {
            var sql = "SELECT distinct e.Id, e.StaffCode, e.FullName, e.Email, e.EmailCongTy, e.CMND, e.DiDong, e.DienThoaiNha, e.Avatar, e.TinhTrangHonNhan, " +
                "e.Groups, e.GioiTinh, e.NgaySinh, e.BangDaiHoc, e.NoiSinh, e.DiemGoc, e.NgayVaoCongTy, e.TrangThaiCongViec, e.WorkIndirectly,  " +
                "e.EmployeeType,  e.BacLD, e.TrinhDoDaoTao, e.ChuyenNganh, e.HinhThucDaoTao, e.BangCap_TrangThai, e.BangCap_NgayNop, e.MEP, e.HeadCount_1, e.HeadCount_2, " +
                "e.Developer, e.Signature, e.Status,  d.EmailConfirmed, d.PhoneNumberConfirmed, d.NoiDaoTao, d.CMND_NgayCap, d.CMND_NoiCap, d.ChieuCao, d.CanNang, " +
                "d.DanToc, d.TonGiao, d.QuocTich, d.SoNamKinhNghiem, d.ThuongTru_Duong, d.ThuongTru_Phuong, d.ThuongTru_Quan, d.ThuongTru_Tinh, " +
                "d.TamTru_Duong, d.TamTru_Phuong, d.TamTru_Quan, d.TamTru_Tinh, d.QueQuan_Duong, d.QueQuan_Phuong, d.QueQuan_Quan, d.QueQuan_Tinh, d.MST, d.TKNH_So, d.TKNH_NganHang, " +
                "d.TKNH_ChiNhanh,  d.BHXH_So, d.BHXH_TinhTrang, d.SoThich, d.DiemManh, d.DiemYeu, d.DinhHuongNgheNghiep, d.KyNangThamGiaTinhNguyen, d.NoiTuyenDung, " +
                "d.CaLamViec,  d.SoTruong, d.SoDoan, d.NamBatDauDiLam,  d.XepLoaiTotNghiep, d.NamTotNghiep, d.LHK_HoTen, d.LHK_DienThoai, d.TinhTrangNhaO, " +
                "d.PhuongTienDiLai, d.NgoaiNgu1_Ten, d.NgoaiNgu1_TrinhDo,  d.NgoaiNgu2_Ten, d.NgoaiNgu2_TrinhDo, d.NgoaiNgu3_Ten, d.NgoaiNgu3_TrinhDo,  " +
                "d.NgoaiNgu4_Ten, d.NgoaiNgu4_TrinhDo, d.KCB_MaBV, d.KCB_MaTinh, d.CH_HoTen, d.CH_NgaySinh,d.CH_Nu, d.CH_KS_Tinh, d.CH_KS_Quan, d.CH_KS_Phuong, d.CH_QuanHe, d.CH_DienThoai, d.CH_SoHK, " +
                "e.CreatedDate,  ct.SoHopDong, ct.LoaiHopDong, ct.TG_Tu, ct.TG_Den, ct.NgayHieuLucHD, ct.MucLuong, " +
                "eo.JobPositionId, eo.OrganizationId, eo.Organizations, jt.Id AS JobTitleId, jt.Priority, jt.[Group] AS GroupTitle, eo.Concurrently, eo.OrgLevel, " +
                "o.Type AS OrgType, jt.Code AS JobTitleCode, jp.GroupId, o.KhuVuc as KhuVucDonVi, d.VungMien, " +
                " (SELECT [dbo].[func_GetEmpOwner] (eo.OrganizationId, eo.JobPositionId)) as OwnerId " +
                "FROM dbo.Employees AS e INNER JOIN " +
                "dbo.EmployeeDetails AS d ON e.Id = d.EmployeeId LEFT OUTER JOIN " +
                "dbo.EmployeeOrganizations AS eo ON e.Id = eo.EmployeeId LEFT OUTER JOIN " +
                "dbo.Organizations AS o ON eo.OrganizationId = o.Id LEFT OUTER JOIN " +
                "dbo.JobPositions AS jp ON jp.Id = eo.JobPositionId LEFT OUTER JOIN " +
                "dbo.JobTitles AS jt ON jt.Id = jp.JobTitleId LEFT OUTER JOIN " +
                "(select ct.EmployeeId, ct.Code as SoHopDong, ct.LoaiHopDong, ct.TG_Tu, ct.TG_Den, ct.NgayHieuLucHD , ct.MucLuong , " +
                "Row_number() OVER(partition BY ct.EmployeeId ORDER BY ct.TG_Tu DESC) AS seqnum " +
                "from ContractLabors ct where Status >= 0) as ct " +
                "on ct.EmployeeId = e.Id and ct.seqnum = 1 " +
                "where e.Status >= 0 and eo.Concurrently = 0 ";

            var where = "";
            if (model.TinhTrangHonNhan.HasValue)
            {
                where += " and e.TinhTrangHonNhan = " + model.TinhTrangHonNhan.Value + " ";
            }
            if (model.GioiTinh.HasValue)
            {
                where += " and e.GioiTinh = " + model.GioiTinh.Value + " ";
            }
            if (model.NoiSinh.HasValue)
            {
                where += " and e.NoiSinh = " + model.NoiSinh.Value + " ";
            }
            if (model.TonGiao.HasValue)
            {
                where += " and e.TonGiao = " + model.TonGiao.Value + " ";
            }
            if (model.DanToc.HasValue)
            {
                where += " and e.DanToc = " + model.DanToc.Value + " ";
            }
            if (model.OrgStr.HasValue())
            {
                var str = model.OrgStr.Replace(";", ",");
                where += " and eo.OrganizationId in (" + str + ") ";
            }

            if (model.TrangThaiCongViec.HasValue)
            {
                where += " and e.TrangThaiCongViec = " + model.TrangThaiCongViec.Value + " ";
            }
            else
            {
                where += " and e.TrangThaiCongViec = 1 ";
            }
            if (model.JobPositionId.HasValue)
            {
                where += " and eo.JobPositionId = " + model.JobPositionId.Value + " ";
            }
            if (model.BacLD.HasValue)
            {
                where += " and e.BacLD = " + model.BacLD.Value + " ";
            }
            if (model.LoaiHopDong.HasValue)
            {
                where += " and c.LoaiHopDong = " + model.LoaiHopDong.Value + " ";
            }
            if (model.NgayVaoCongTyFrom.HasValue)
            {
                where += " and e.NgayVaoCongTy >= '" + model.NgayVaoCongTyFrom.Value.FormatDate("yyyy-MM-dd") + "' ";
            }
            if (model.NgayVaoCongTyTo.HasValue)
            {
                where += " and e.NgayVaoCongTy <= '" + model.NgayVaoCongTyTo.Value.FormatDate("yyyy-MM-dd") + "' ";
            }

            if (model.ThamNienFrom.HasValue)
            {
                var now = DateTime.Now;
                var f = now.AddYears(-model.ThamNienFrom.Value);
                where += " and e.NgayVaoCongTy <= '" + f.FormatDate("yyyy-MM-dd") + "' ";
            }
            if (model.ThamNienTo.HasValue)
            {
                var now = DateTime.Now;
                var f = now.AddYears(-model.ThamNienTo.Value);
                where += " and e.NgayVaoCongTy >= '" + f.FormatDate("yyyy-MM-dd") + "' ";
            }


            if (model.DiemGoc.HasValue)
            {
                where += " and e.DiemGoc = " + model.DiemGoc + " ";
            }
            if (model.NoiTuyenDung.HasValue)
            {
                where += " and d.NoiTuyenDung = " + model.NoiTuyenDung + " ";
            }
            if (model.TruongHoc.HasValue)
            {
                where += " and d.NoiDaoTao = " + model.TruongHoc + " ";
            }

            if (model.TrinhDoDaoTao.HasValue)
            {
                where += " and e.TrinhDoDaoTao = " + model.TrinhDoDaoTao + " ";
            }
            if (model.ChuyenNganh.HasValue)
            {
                where += " and e.ChuyenNganh = " + model.ChuyenNganh + " ";
            }

            if (model.HinhThucDaoTao.HasValue)
            {
                where += " and e.HinhThucDaoTao = " + model.HinhThucDaoTao + " ";
            }

            if (model.TamTru_Tinh.HasValue)
            {
                where += " and d.TamTru_Tinh = " + model.TamTru_Tinh + " ";
            }
            if (model.TamTru_Quan.HasValue)
            {
                where += " and d.TamTru_Quan = " + model.TamTru_Quan + " ";
            }
            if (model.TamTru_Phuong.HasValue)
            {
                where += " and d.TamTru_Phuong = " + model.TamTru_Phuong + " ";
            }
            if (model.ThuongTru_Tinh.HasValue)
            {
                where += " and d.ThuongTru_Tinh = " + model.ThuongTru_Tinh + " ";
            }
            if (model.ThuongTru_Quan.HasValue)
            {
                where += " and d.ThuongTru_Quan = " + model.ThuongTru_Quan + " ";
            }
            if (model.ThuongTru_Phuong.HasValue)
            {
                where += " and d.ThuongTru_Phuong = " + model.ThuongTru_Phuong + " ";
            }
            if (model.QueQuan_Tinh.HasValue)
            {
                where += " and d.QueQuan_Tinh = " + model.QueQuan_Tinh + " ";
            }
            if (model.QueQuan_Quan.HasValue)
            {
                where += " and d.QueQuan_Quan = " + model.QueQuan_Quan + " ";
            }
            if (model.QueQuan_Phuong.HasValue)
            {
                where += " and d.QueQuan_Phuong = " + model.QueQuan_Phuong + " ";
            }
            if (model.WorkIndirectly.HasValue)
            {
                where += " and e.WorkIndirectly = " + (model.WorkIndirectly.Value ? "1" : "0") + " ";
            }
            if (model.KhuVucDonVi.HasValue)
            {
                where += " and o.KhuVuc = " + model.KhuVucDonVi + " ";
            }
            if (model.VungMien.HasValue)
            {
                where += " and d.VungMien = " + model.VungMien + " ";
            }
            sql += where;

            sql = "select * from ( " + sql + " ) as x ";

            if (model.QuanLy.HasValue)
            {
                sql += " where x.OwnerId = '" + model.QuanLy.Value + "' ";
            }

            CheckDbConnect();
            var result = Context.Database.SqlQuery<EmployeeExportViewModel>(sql).ToList();

            return result;

        }
 
        public List<EmpBaseItem> EmpBaseList(SearchEmployeeModel model)
        {
            CheckDbConnect();

            IQueryable<Employee> q = Context.Employees;

            if (model.Ids != null)
            {
                q = q.Where(x => model.Ids.Contains(x.Id));
            } 
             


            var r = q.Select(x => new EmpBaseItem()
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email
            }).ToList();


            return r;
        }
    }
}