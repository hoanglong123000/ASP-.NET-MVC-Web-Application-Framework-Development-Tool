﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;

using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Core.Executes.Employees.EmployeeOrganizations;
using Service.Core.Executes.General.OptionValues;
using Service.Core.Executes.General.Organizations;
using Service.Core.Variables;

namespace Service.Core.Variables
{
    public class ProductSuggestion
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string Attributes { get; set; }

        public string Name
        {
            get
            {
                if (!string.IsNullOrEmpty(Attributes))
                {
                    var js = new JavaScriptSerializer();
                    var attrs = js.Deserialize<List<BaseJsonModel>>(Attributes);
                    var text = attrs.Select(x => x.text).ToList();
                    var n = ProductName + " - " + string.Join(" - ", text);
                    return n;
                }

                return ProductName;
            }
        }
        public int Media { get; set; }
        public int Type { get; set; }
        public string UnitName { get; set; }
        public string Code { get; set; }
        public string Sub { get; set; }
        public decimal SalePrice { get; set; }
    }

    
}