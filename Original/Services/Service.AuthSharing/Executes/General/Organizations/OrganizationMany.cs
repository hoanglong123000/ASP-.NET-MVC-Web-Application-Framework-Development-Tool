
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using DBContext.Core.Entities;
using System.Linq;
using Service.Core.Executes.Employees.Employees;
using Service.Utility.Components;
using Service.Core.Executes.General.Organizations;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.LocalOrganizations;

namespace Service.AuthSharing.Executes.Base
{

    public partial class AuthSharingService
    {
        public QueryResult<LocalOrganizationViewModel> OrganizationViewMany(SearchLocalOrganizationModel model, OptionResult option)
        {
            CheckDbConnect();
            IQueryable<LocalOrganization> q1 = Context.LocalOrganizations.Where(x => x.Status >= 0);

            if (model.Id.HasValue)
            {
                q1 = q1.Where(x => x.Id == model.Id.Value);
            }

            if (model.Status.HasValue)
            {
                q1 = q1.Where(x => x.Status == model.Status.Value);
            }
            if (model.Stopped.HasValue)
            {
                q1 = q1.Where(x => x.Stopped == model.Stopped.Value);
            }
            if (!model.HasStopped)
            {
                q1 = q1.Where(x => !x.Stopped);
            }

            if (!string.IsNullOrEmpty(model.Keyword))
            {
                q1 = q1.Where(x => x.Keyword.Contains(model.Keyword));
            }

            if (model.Type.HasValue)
            {
                q1 = q1.Where(x => x.Type == model.Type.Value);
            }


            var r = q1.Select(x => new LocalOrganizationViewModel()
            {
                Name = x.Name,
                Id = x.Id,
                Status = x.Status,
                Type = x.Type,
                Stopped = x.Stopped,
                Code = x.Code,
                Priority = x.Priority,
                KhuVuc = x.KhuVuc,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                InOwnerId1 = x.InOwnerId1,
                InOwnerId2 = x.InOwnerId2,
                InOwnerId3 = x.InOwnerId3,
                InOwnerId4 = x.InOwnerId4,
                OwnerId = x.OwnerId
            });

            if (!string.IsNullOrEmpty(option.OrderBy))
            {
                switch (option.OrderBy)
                {
                    case "Name":
                        {
                            r = option.OrderType == "desc" ? r.OrderByDescending(x => x.Name) : r.OrderBy(x => x.Name);
                        }
                        break;
                    default:
                        {
                            r = r.OrderBy(x => x.Priority);
                        }
                        break;
                }
            }
            else
            {
                r = r.OrderBy(x => x.Priority);
            }

            var result = new QueryResult<LocalOrganizationViewModel>(r, option);
            if (result.Many.Any())
            {
                var opt = OptionValueBaseList("KhuVuc");
                var opt2 = OptionValueBaseList("LoaiBoPhan");
                var empids = result.Many.Where(x => x.OwnerId.HasValue).Select(x => x.OwnerId.Value).ToList();
                empids.AddRange(result.Many.Select(x => x.CreatedBy).ToList());
                empids.AddRange(result.Many.Select(x => x.UpdatedBy).ToList());

                empids.AddRange(result.Many.Where(x => x.InOwnerId1.HasValue).Select(x => x.InOwnerId1.Value).ToList());
                empids.AddRange(result.Many.Where(x => x.InOwnerId2.HasValue).Select(x => x.InOwnerId2.Value).ToList());
                empids.AddRange(result.Many.Where(x => x.InOwnerId3.HasValue).Select(x => x.InOwnerId3.Value).ToList());
                empids.AddRange(result.Many.Where(x => x.InOwnerId4.HasValue).Select(x => x.InOwnerId4.Value).ToList());

                var emps = EmployeeBaseList(new SearchEmployeeModel()
                {
                    Ids = empids.Distinct().ToList(),
                });

                foreach (var item in result.Many)
                {

                    item.ObjOwner = emps.FirstOrDefault(x => x.Id == item.OwnerId);
                    item.ObjInOwner1 = emps.FirstOrDefault(x => x.Id == item.InOwnerId1);
                    item.ObjInOwner2 = emps.FirstOrDefault(x => x.Id == item.InOwnerId2);
                    item.ObjInOwner3 = emps.FirstOrDefault(x => x.Id == item.InOwnerId3);
                    item.ObjInOwner4 = emps.FirstOrDefault(x => x.Id == item.InOwnerId4);

                    item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
                    item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);

                    item.ObjLoaiBoPhan = opt2.FirstOrDefault(x => x.Code == item.Type + "");
                    item.ObjKhuVuc = opt.FirstOrDefault(x => x.Code == item.KhuVuc + "");
                }
            }

            return result;
        }
        public List<BaseItem> OrganizationBaseList()
        {
            if (_dataMethod == 1)
                return _coreService.OrganizationBaseList();

            var name = "OrganizationBaseList";

            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }
            CheckDbConnect();
            var data = Context.LocalOrganizations.Where(x => !x.Stopped && x.Status >= 0).Select(x => new BaseItem()
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name
            }).ToList();
            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;
        }

        public List<BaseItem> OrganizationBaseListByIds(string idStr)
        {
            if (_dataMethod == 1)
                return _coreService.OrganizationBaseListByIds(idStr);

            if (idStr.Any())
            {
                var ids = idStr.Split(';').Select(Int32.Parse).ToList();

                CheckDbConnect();

                var result = Context.LocalOrganizations.Where(x => ids.Contains(x.Id)).Select(x => new BaseItem()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code
                }).ToList();

                return result;
            }
            return new List<BaseItem>();
        }

        public List<BaseItem> OrganizationAllBaseList()
        {

            if (_dataMethod == 1)
                return _coreService.OrganizationAllBaseList();

            CheckDbConnect();
            var name = "OrganizationAllBaseList";

            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<BaseItem>>(dataStr);
            }

            var data = Context.LocalOrganizations.Where(x => x.Status >= 0).Select(x => new BaseItem()
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name
            }).ToList();
            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;
        }

        public List<EmployeeBaseView> OrganizationIndirectManagerList(int orgId)
        {
            if (_dataMethod == 1)
                return _coreService.OrganizationIndirectManagerList(orgId);

            var name = "OrganizationIndirectManagers_" + orgId;

            var dataStr = Caching.Load(name, "general");
            if (!string.IsNullOrEmpty(dataStr))
            {
                return Serializer.Deserialize<List<EmployeeBaseView>>(dataStr);
            }

            CheckDbConnect();
            var data = new List<EmployeeBaseView>();
            var org = Context.LocalOrganizations.FirstOrDefault(x => x.Id == orgId);
            if (org != null)
            {
                
            }

            Caching.Save(name, "general", Serializer.Serialize(data));
            return data;
        }
    }
}
