using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<object> JoinEmpDataCommand(JoinDataModel model)
        {
            CheckDbConnect();
            try
            {
                
                switch (model.Type)
                {
                    case "JobPosition":
                        {
                            var sql = "update EmployeeOrganizations set JobPositionId = " + model.FromId +
                                      " where JobPositionId =  " + model.ToId;
                            Context.Database.ExecuteSqlCommand(sql); 
                            sql = "update EmployeeWorkProcesses set JobPositionId = " + model.FromId +
                                  " where JobPositionId =  " + model.ToId;
                            Context.Database.ExecuteSqlCommand(sql);
                        }
                        break;
                    case "Organization":
                        {
                            var sql = "update EmployeeOrganizations set OrganizationId = " + model.FromId +
                                      " where OrganizationId =  " + model.ToId;
                            Context.Database.ExecuteSqlCommand(sql);
                            sql = "update EmployeeWorkProcesses set OrganizationId = " + model.FromId +
                                  " where OrganizationId =  " + model.ToId;
                            Context.Database.ExecuteSqlCommand(sql); 
                        }
                        break;
                }
                return new CommandResult<object>(true);
            }
            catch (Exception e)
            {
                return new CommandResult<object>(e.Message);
            }
        }
    }
}