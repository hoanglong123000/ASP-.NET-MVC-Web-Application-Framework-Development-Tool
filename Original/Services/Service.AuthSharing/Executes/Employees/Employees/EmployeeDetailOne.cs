using Service.BCT.Executes.Employees.Employees;
using Service.BCT.Executes.General.Districts;
using Service.BCT.Executes.General.OptionValues;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public EmployeeDetailViewModel EmployeeDetailOne(Guid employeeid)
        {
            CheckDbConnect();
            var sql = "select * from EmployeeDetails where EmployeeId = '" + employeeid + "'";
            var result = Context.Database.SqlQuery<EmployeeDetailViewModel>(sql).FirstOrDefault();
            if (result != null)
            {
                result.ThuongTru_Address = GetAddress(result.ThuongTru_Tinh, result.ThuongTru_Quan, result.ThuongTru_Phuong, result.ThuongTru_Duong);
                result.QueQuan_Address = GetAddress(result.QueQuan_Tinh, result.QueQuan_Quan, result.QueQuan_Phuong, result.QueQuan_Duong);
                result.TamTru_Address = GetAddress(result.TamTru_Tinh, result.TamTru_Quan, result.TamTru_Phuong, result.TamTru_Duong);
                var opt1 = OptionValueMany(new SearchOptionValueModel() { Cache = true, Type = "DanToc" },
                    new OptionResult() { Unlimited = true }).Many;
                var opt2 = OptionValueMany(new SearchOptionValueModel() { Cache = true, Type = "TonGiao" },
                    new OptionResult() { Unlimited = true }).Many;
                var opt3 = OptionValueMany(new SearchOptionValueModel() { Cache = true, Type = "KhuVuc" },
                    new OptionResult() { Unlimited = true }).Many; 
                result.ObjDanToc = opt1.FirstOrDefault(x => x.Id == result.DanToc);
                result.ObjTonGiao = opt2.FirstOrDefault(x => x.Id == result.TonGiao); 
                result.ObjNoiTuyenDung = opt3.FirstOrDefault(x => x.Id == result.NoiTuyenDung);
                result.ObjVungMien = opt3.FirstOrDefault(x => x.Code == result.VungMien + "");

                var countries = CountryMany(true).Many;

                result.ObjCMND_NoiCap = countries.FirstOrDefault(x => x.Id == result.CMND_NoiCap);

            }
            return result;
        }

        public string GetAddress(int? country, int? district, int? ward, string street)
        {
            CheckDbConnect();
            var address = new List<string>();

            if (!string.IsNullOrEmpty(street))
            {
                address.Add(street);
            }

            var w = district.HasValue ? WardMany(district.Value, true).FirstOrDefault(x => x.Id == ward) :
                Context.Wards.FirstOrDefault(x => x.Id == ward);

            if (w != null)
            {
                address.Add(w.Name);
            }

            var d = country.HasValue ? DistrictMany(new SearchDistrictModel()
            {
                CountryId = country,
                Cache = true
            }, new OptionResult() { Unlimited = true }).Many.FirstOrDefault(x => x.Id == district) :
                Context.Districts.FirstOrDefault(x => x.Id == district);
            if (d != null)
            {
                address.Add(d.Name);
            } 

            var countries = CountryMany(true).Many;
            var c = countries.FirstOrDefault(x => x.Id == country);
            if (c != null)
            {
                address.Add(c.Name);
            }

            return string.Join(", ", address);
        }

        public string GetEmployeeScanSignature(Guid employeeId)
        {
            CheckDbConnect();
            var signature = Context.Database.SqlQuery<string>(
                "select top 1 Signature from Employees where Id = '" +
                employeeId + "'").FirstOrDefault();
            return signature;
        }
    }
}