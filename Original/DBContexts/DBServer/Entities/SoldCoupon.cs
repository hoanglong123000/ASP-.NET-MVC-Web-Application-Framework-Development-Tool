using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBServer.Entities
{

    public partial class SoldCoupon
    {
        [Key]
        public int Id { get; set; }
        public int Status { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Keyword { get; set; }
        public DateTime SoldDate { get; set; }
        public string BuyerName { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressBuyer { get; set; }
        public int IsOnlineShop { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
