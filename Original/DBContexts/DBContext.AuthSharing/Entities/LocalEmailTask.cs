//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DBContext.AuthSharing.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class LocalEmailTask
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public int ReceiverType { get; set; }
        public string Receivers { get; set; }
        public Nullable<int> CCType { get; set; }
        public string CC { get; set; }
        public string BodyPath { get; set; }
        public string Attachs { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public bool Remind { get; set; }
        public string Module { get; set; }
        public string EmailType { get; set; }
        public Nullable<int> ObjectId { get; set; }
        public Nullable<System.Guid> ObjectGuid { get; set; }
        public Nullable<System.DateTime> SentDate { get; set; }
        public int SentNumber { get; set; }
        public int Status { get; set; }
        public string Error { get; set; }
        public string AlternateViews { get; set; }
        public string Note { get; set; }
    }
}