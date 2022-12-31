
namespace DBServer.Entities
{
    using System;
    using System.Collections.Generic;

    public partial class StudentView
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public string Keyword { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid UpdatedBy { get; set; }
        public string Avatar { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Nullable<System.DateTime> NgaySinh { get; set; }
        public int GioiTinh { get; set; }
        public int GroupId { get; set; }
        public string MoTa { get; set; }
        public string TomTat { get; set; }
        public string NguoiTao { get; set; }
    }
}
