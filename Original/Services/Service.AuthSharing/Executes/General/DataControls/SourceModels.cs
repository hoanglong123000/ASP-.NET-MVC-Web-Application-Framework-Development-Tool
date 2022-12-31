using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 

namespace Service.AuthSharing.Executes.Base
{
    public class JoinDataModel
    {
        public string Type { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public string FromCode { get; set; }
        public string ToCode { get; set; }
        public string Code { get; set; }
    }
}