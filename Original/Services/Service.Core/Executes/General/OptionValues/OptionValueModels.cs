using DBServer.Entities;
using System;
using System.Collections.Generic; 

namespace Service.Education.Executes.General.OptionValues
{
    public class SearchOptionValueModel
    {
        public int? Id { get; set; }
        public int NearId { get; set; }
        public List<int> Ids { get; set; }
        public string Code { get; set; }
        public string Keyword { get; set; }
        public string Type { get; set; }
        public List<string> Types { get; set; }
        public bool Cache { get; set; }
        public string PriorityPosition { get; set; }
        public string MoRong1 { get; set; }
        public int? Minute { get; set; }
    }

    public class OptionValueSummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string MoRong1 { get; set; }
    }
    public class OptionValueViewModel
    {
        public int Id { get; set; }
        public string Keyword { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string MoRong1 { get; set; }
        public string MoRong2 { get; set; }
        public string MoRong3 { get; set; }
        public string MoRong4 { get; set; }
        public string MoRong5 { get; set; }
        public string Note { get; set; }
        public System.Guid CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public System.Guid UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int Status { get; set; }
        public int Priority { get; set; }
        public bool AllowChange { get; set; }
    }
    public class OptionValueEditModel : OptionValue
    {
        public bool Active { get; set; }
    }
}
