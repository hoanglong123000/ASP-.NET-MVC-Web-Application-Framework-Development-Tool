//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DBServer.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Group
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Keyword { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<int> Priority { get; set; }
        public int Status { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime CreateDate { get; set; }
        public System.Guid UpdatedBy { get; set; }
        public System.DateTime UpdatedDate { get; set; }
        public bool AllowHrm { get; set; }
        public bool AllowPortal { get; set; }
        public int AllowData { get; set; }
    }
}