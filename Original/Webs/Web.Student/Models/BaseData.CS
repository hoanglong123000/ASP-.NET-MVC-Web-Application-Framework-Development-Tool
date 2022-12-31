using System;
using System.Collections.Generic;
using System.Web;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using DBServer.Entities;
using Service.Core.Components;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Core.Executes.General.FeatureGroups;
using Service.Utility.Variables;

namespace Web.Student.Models
{
    public class BaseData
    {
        public Category ActiveCate { get; set; }
        public EmployeeAuthViewModel AuthData { get; set; }
        public string PathAndQuery { get; set; }
        public List<AppSetting> Settings { get; set; }
		public List<LocalSetting> LocalSettings { get; set; }
		public List<FeatureGroupViewModel> FeatureGroups { get; set; }
        public HttpContextBase Context { get; set; }
        public string Browser { get; set; }
        public bool IsAdmin { get; set; }
        public string Version { get; set; }
        //public string UserDefaultAvatar => Settings.GetValue("general", "domain_api") + "/media/default/user-default.jpg";
         
    }
}