using System.Data.Entity.Infrastructure;

namespace DBServer.Entities
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ServerDBContext : DbContext
    {
        public ServerDBContext()
            : base("name=ServerDBContext")
        {
        }

        //public virtual DbSet<AppSetting> AppSettings { get; set; }
        //public virtual DbSet<EmployeeAuth> EmployeeAuths { get; set; }
        //public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<FeatureGroup> FeatureGroups { get; set; }
        public virtual DbSet<Feature> Features { get; set; }
        public virtual DbSet<Group> Groups { get; set; }

        public virtual DbSet<ResourceDemo> ResourceDemos { get; set; }
        //public virtual DbSet<EmployeeView> EmployeeViews { get; set; }

        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<OptionValue> OptionValues { get; set; }
        public virtual DbSet<SizeTab> SizeTabs { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<TypeClothe> TypeClothes { get; set; }
        public virtual DbSet<Cloth> Clothes { get; set; }
        public virtual DbSet<SoldCoupon> SoldCoupons { get; set; }
        public virtual DbSet<DetailReceipt> DetailReceipts { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //throw new UnintentionalCodeFirstException();
        }
    }
}
