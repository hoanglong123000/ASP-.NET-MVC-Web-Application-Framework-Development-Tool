using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBServer.Entities
{
    public partial class ImportedCoupon
    {
        [Key]
        public int Id { get; set; }
        public int Status { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Keyword { get; set; }
        public DateTime ImportedDate { get; set; }
        public int ProviderId { get; set; }
        public string Note { get; set; }
        public decimal TotalPrice { get; set; }
        
    }
}
