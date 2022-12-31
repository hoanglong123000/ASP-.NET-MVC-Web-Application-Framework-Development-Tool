  
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
        public QueryResult<EmployeeView> EmployeeViews(SearchEmployeeModel model, OptionResult option)
        {
            CheckDbConnect();

            IQueryable<EmployeeView> q = Context.EmployeeViews;

            if (model.Keyword.HasValue())
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Email.HasValue())
            {
                q = q.Where(x => x.EmailCongTy.Contains(model.Email));
            }

            q = q.OrderBy(x => x.FullName);
             
            var result = new QueryResult<EmployeeView>(q, option);
             

            return result;

        }

        public List<EmpBaseItem> EmployeeSuggestions(SearchEmployeeModel model, OptionResult option)
        {
            IQueryable<EmployeeView> q = Context.EmployeeViews;

            if (model.Keyword.HasValue())
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Email.HasValue())
            {
                q = q.Where(x => x.EmailCongTy.Contains(model.Email));
            }

            var r = q.Select(x => new EmpBaseItem
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.EmailCongTy
            }).ToList();
            return r;
        }

        public QueryResult<EmpBaseItem> EmployeeSuggestionMany(SearchEmployeeModel model, OptionResult option)
        {
            CheckDbConnect();

            IQueryable<EmployeeView> q = Context.EmployeeViews;

            if (model.Keyword.HasValue())
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Email.HasValue())
            {
                q = q.Where(x => x.EmailCongTy.Contains(model.Email));
            }

            var r = q.Select(x => new EmpBaseItem
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.EmailCongTy
            }).ToList();

            var result = new QueryResult<EmpBaseItem>(r, option);

            return result;
        }

        public List<NhanSuTheoDoDuoi> GetNhanSuTheoDoDuoi()
        {
            var name = "ThongKeNhanSuTheoDoTuoi";

            var dataStr = Caching.Load(name, "report");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<NhanSuTheoDoDuoi>>(dataStr);
            }

            CheckDbConnect();
            var sql = "select count(*) from ( select  StaffCode, NgaySinh, GioiTinh, DATEDIFF(year, NgaySinh, GETDATE()) as Tuoi  " +
                      "FROM Employees where Status >= 0 and TrangThaiCongViec = 'DLV' ) as q1 where";

            var data = new List<NhanSuTheoDoDuoi>(){
                new NhanSuTheoDoDuoi() {
                    DoTuoi = 1,
                    Nam = Context.Database.SqlQuery<int>(sql + " q1.Tuoi < 22 and q1.GioiTinh = 1").FirstOrDefault(),
                    Nu = Context.Database.SqlQuery<int>(sql + " q1.Tuoi < 22 and q1.GioiTinh = 2").FirstOrDefault(),
                },
                new NhanSuTheoDoDuoi() {
                    DoTuoi = 2,
                    Nam = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 22 and q1.Tuoi <= 29 and q1.GioiTinh = 1").FirstOrDefault(),
                    Nu = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 22 and q1.Tuoi <= 29 and q1.GioiTinh = 2").FirstOrDefault(),
                },
                new NhanSuTheoDoDuoi() {
                    DoTuoi = 3,
                    Nam = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 30 and q1.Tuoi <= 39 and q1.GioiTinh = 1").FirstOrDefault(),
                    Nu = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 30 and q1.Tuoi <= 39 and q1.GioiTinh = 2").FirstOrDefault(),
                },
                new NhanSuTheoDoDuoi() {
                    DoTuoi = 4,
                    Nam = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 40 and q1.Tuoi <= 49 and q1.GioiTinh = 1").FirstOrDefault(),
                    Nu = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 40 and q1.Tuoi <= 49 and q1.GioiTinh = 2").FirstOrDefault(),
                },
                new NhanSuTheoDoDuoi() {
                    DoTuoi = 5,
                    Nam = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 50 and q1.Tuoi <= 59 and q1.GioiTinh = 1").FirstOrDefault(),
                    Nu = Context.Database.SqlQuery<int>(sql + " q1.Tuoi >= 50 and q1.Tuoi <= 59 and q1.GioiTinh = 2").FirstOrDefault(),
                },
           };

            Caching.Save(name, "report", Serializer.Serialize(data));
            return data;
        } 
        
        public List<EmployeeSuggestion> EmployeeSuggestionByFeatureGroups(SearchEmployeeModel model)
        {
            CheckDbConnect();
            var where = new List<string>();

            if (model.FeatureCode.HasValue())
            {
                where.Add(" f.Code = '" + model.FeatureCode + "' ");
            }

            if (model.AllowApproval.HasValue)
            {
                where.Add(" fg.AllowApproval = " + (model.AllowApproval.Value ? "1" : "0") + " ");
            }
            var sql = "select e.Id, e.StaffCode, e.FullName, e.Email, e.DiDong, e.JobPositionId, e.Organizations  from Employees e where e.Id in ( " +
                "select distinct eg.EmployeeId from Features f " +
                "join FeatureGroups fg on f.Id = fg.FeatureId " +
                "join EmployeeGroups eg on eg.GroupId = fg.GroupId " + (where.Any() ? " where " + string.Join(" and ", where) : "") + " )";

            var result = Context.Database.SqlQuery<EmployeeSuggestion>(sql).ToList();
            if (result.Any())
            {
                 
            }
            return result;
        }

        
        public List<TTCVModel> TrangThaiCongViecSummaryList()
        {
            CheckDbConnect();
            var result = Context.Database
                .SqlQuery<TTCVModel>(
                    "select TrangThaiCongViec as TrangThai, count(1) as Total from Employees where Status >= 0 group by TrangThaiCongViec")
                .ToList();

            return result;
        }

        public List<EmployeeSuggestion> OrganizationOwnerList(SearchEmployeeModel model)
        {
            CheckDbConnect();
            var sql = "SELECT e.Id, e.StaffCode, e.FullName, e.EmailCongTy, op.OrganizationId, op.JobPositionId from OrganizationPositions op " +
            "join EmployeeOrganizations eo on op.OrganizationId = eo.OrganizationId and eo.JobPositionId = op.JobPositionId " +
            "join Organizations o on op.OrganizationId = o.Id " +
            "join Employees e on eo.EmployeeId = e.Id " +
            "where op.IsOwner = 1 and e.TrangThaiCongViec = 1 and e.Status >= 0 and o.Status >= 0 ";

            if (model.OrgStr.HasValue())
            {
                var str = model.OrgStr.Replace(";", ",");
                sql += " and op.OrganizationId in (" + str + ") ";
            }

            var result = Context.Database.SqlQuery<EmployeeSuggestion>(sql).ToList();

            return result;
        }


    }
}