﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DBServer.Entities
{
    public partial class TradeHistorie
    {
        [Key]
        public int Id { get; set; }
        public int Status { get; set; }
        public string Keyword { get; set; }
        public int ClothesId { get; set; }
        public DateTime TradeTime { get; set; }
        public int Amount { get; set; }
    }
}
