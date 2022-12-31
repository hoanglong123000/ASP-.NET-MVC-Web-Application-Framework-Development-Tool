using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using DBServer.Entities;
using Service.Education.Executes.Base;
using Service.Utility.Variables;

namespace Service.Education.Components
{
    public class IdImgModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Media { get; set; }
        public string Name { get; set; }
        public string ThumbSize { get; set; }
        public int? ShopId { get; set; }
    }
    public static class Component
    { 
        public static string GetValue(this List<AppSetting> list, string tab, string section)
        {
            var s = list.FirstOrDefault(x => x.Tab == tab && x.Section == section);
            if (s != null)
                return s.Value;
            return "";
        }
         
    }
}