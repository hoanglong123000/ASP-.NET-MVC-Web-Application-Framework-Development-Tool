using System.Collections.Generic;
using System.Linq;
using DBContext.BCT.Entities;
using Service.Utility.Components;
using Service.BCT.Executes.Employees.Employees;
using Service.Utility.Variables;
using Service.Utility.Variables;


namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public int? Role { get; set; }
        public bool? Cache { get; set; }
        public string Keyword { get; set; }
        public int? Limit { get; set; }
        public List<EmployeeSuggestion> Do()
        {
            if (Cache.HasValue && Cache.Value)
            {
                var cachename = new List<string> { "user_suggestions" };
                if (!string.IsNullOrEmpty(Keyword))
                {
                    Keyword = Keyword.Optimize().RemoveNewLine();
                    cachename.Add("key_" + Keyword);
                }
                if (Limit.HasValue)
                {
                    cachename.Add("limit_" + Limit.Value);
                }
                var name = string.Join("_", cachename);
                var dataStr = Caching.Load(name, "suggestions");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<List<EmployeeSuggestion>>(dataStr);
                }
                var data = GetData();
                Caching.Save(name, "suggestions", Serializer.Serialize(data));
                return data;
            }
            return GetData();
        }

        private List<EmployeeSuggestion> GetData()
        {
            CheckDbConnect();
            IQueryable<Employee> query = Context.Employees;

            if (!string.IsNullOrEmpty(Keyword))
            {
                query = query.Where(x => x.Keyword.Contains(Keyword));
            }
            query = query.OrderBy(x => x.FullName).Take(Limit ?? 4);
            return query.Select(x => new EmployeeSuggestion()
            {
                Id = x.Id,
                FullName = x.FullName
            }).ToList();
        }

    }
}
