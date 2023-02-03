using System;
using System.Collections.Generic; 
using System.Linq;
using System.Text; 
using Service.Utility.Components;
using Service.Utility.Variables;
using DBServer.Entities;
using System.Data.Entity.Validation;
using Service.Education.Executes.Clothesmn.TradeHistories;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<TradeHistorie> CreateTradeHistorie(TradeHistorieEditModel model)
        {
            CheckDbConnect();
            try
            {
                var d = new TradeHistorie
                {
                    Id = model.Id,
                    Status = model.Status,
                    Keyword = model.TradeTime.ToString(),
                    ClothesId = model.ClothesId,
                    TradeTime = DateTime.Today,
                    Amount = model.Amount
                };
               
                
                Context.TradeHistories.Add(d);
                Context.SaveChanges();
                //DeleteCaching 
                return new CommandResult<TradeHistorie>(d);
            }
            catch (DbEntityValidationException e)
            {
                StringBuilder sb = new StringBuilder();
                foreach (var eve in e.EntityValidationErrors)
                {
                    foreach (var ve in eve.ValidationErrors)
                    {
                        sb.AppendLine(string.Format("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName,
                            ve.ErrorMessage));
                    }
                }
                return new CommandResult<TradeHistorie>(sb.ToString());
            }
        }
        public CommandResult<TradeHistorie> EditTradeHistorie(TradeHistorieEditModel model)
        {
            CheckDbConnect();
            var d = Context.TradeHistories.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return new CommandResult<TradeHistorie>("No result!");

            var notes = new List<string>()
            {

            };
            d.Id = model.Id;
            d.ClothesId = model.ClothesId;
            d.Status = model.Status;
            d.Keyword = model.TradeTime.ToString();
            d.TradeTime = DateTime.Now;
            d.Amount = model.Amount;

            Context.SaveChanges();

            return new CommandResult<TradeHistorie>(d);
        }

        public void DeleteTradeHistorieByIds(List<int> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "" + x + "").ToList();
            var idStr = string.Join(",", arr);
            Context.Database.ExecuteSqlCommand(
                "update TradeHistories set Status = -1 " +
                "where Id in ('" + idStr + "')"); 
        }
       /* public bool UpdateBrandStatus(int id, int status)
        {
            CheckDbConnect();
            var m = Context.Students.FirstOrDefault(x => x.Id == id);
            if (m == null)
                return false;

            m.Status = status;
            Context.SaveChanges();
             
            return true;
        }*/
         
    }
}