using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DBServer.Entities
{
    public partial class DetailReceipt
    {
        [Key]
        public int Id { get; set; }
        public int Status { get; set; }
        public string Keyword { get; set; }
        public int ClothesId { get; set; }
        public string UnitMeasure { get; set; }
        public int Ammount { get; set; }
        public decimal Price { get; set; }
        public decimal FinalPrice { get; set; }
        public int CouponId { get; set; }
        
    }
}
