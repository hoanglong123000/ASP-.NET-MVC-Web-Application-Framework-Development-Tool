using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Educations.Students
{
    public class SearchStudentModel
    {
        public List<int> Ids { get; set; }
        public string Keyword { get; set; }
        public bool Cache { get; set; }
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public DateTime? UpdatedDateFrom { get; set; }
        public DateTime? UpdatedDateTo { get; set; }

        public DateTime? NgaySinhFrom { get; set; }
        public DateTime? NgaySinhTo { get; set; }
        public int? GioiTinh { get; set; }
        public int? GroupId { get; set; }
    }

    public class StudentViewModel : Student
    {
        public BaseItem ObjType { get; set; }
        public BaseItem ObjStudentState { get; set; }
        public BaseItem objStudentTypes { get; set; }
        public BaseItem MyProperty { get; set; }
         
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
    }

    public class StudentEditModel : Student
    {
        [AllowHtml]
        public string MoTaHtml { get; set; }
        //Columns
    }
}
