using DBContext.AuthSharing.Entities;
using System;

namespace Service.AuthSharing.Executes.Email
{
    public class SearchEmailTaskModel
    {
        public int? Status { get; set; }
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public DateTime? SentDateFrom { get; set; }
        public DateTime? SentDateTo { get; set; }
        public string Receivers { get; set; }
    }

    public class AlternateViewModel
    {
        public string Path { get; set; }
        public string ContenId { get; set; }
    }

	public class LocalEmailTaskViewModel : LocalEmailTask
	{
		public string Body { get; set; }
	}
}
