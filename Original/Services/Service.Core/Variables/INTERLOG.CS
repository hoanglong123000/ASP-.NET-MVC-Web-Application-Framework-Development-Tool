using Service.Core.Components;
using Service.Core.Components;

namespace Service.Core.Variables
{
    public class InterLog
    {
        public AuthDataModel Perform { get; set; }

        public string PerformedBy
        {
            get
            {
                if (Perform != null)
                {
                    return Perform.UserId + ";" + ";" + Perform.FullName;
                }
                return "";
            }
        }
    }
}