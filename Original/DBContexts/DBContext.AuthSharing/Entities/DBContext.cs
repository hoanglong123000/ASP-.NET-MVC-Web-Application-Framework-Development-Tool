using System.Data.Entity.Infrastructure;

namespace DBContext.AuthSharing.Entities
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class AuthSharingContext : DbContext
    {
        public AuthSharingContext()
            : base("name=AuthSharingContext")
        {
        }
        public virtual DbSet<LocalEmailTask> LocalEmailTasks { get; set; }
        public virtual DbSet<LocalSetting> LocalSettings { get; set; } 
        public virtual DbSet<LocalEmployeeAuthView> LocalEmployeeAuthViews { get; set; }  
        public virtual DbSet<LocalEmployee> LocalEmployees { get; set; }
        public virtual DbSet<LocalEmployeeView> LocalEmployeeViews { get; set; }
        public virtual DbSet<LocalEmpWorkLog> LocalEmpWorkLogs { get; set; } 
        public virtual DbSet<LocalFeatureGroup> LocalFeatureGroups { get; set; }
        public virtual DbSet<LocalFeature> LocalFeatures { get; set; }
        public virtual DbSet<LocalGroup> LocalGroups { get; set; }
        public virtual DbSet<LocalJobPosition> LocalJobPositions { get; set; } 
        public virtual DbSet<LocalEmployeeBaseView> LocalEmployeeBaseViews { get; set; } 
        public virtual DbSet<LocalJobTitle> LocalJobTitles { get; set; }
        public virtual DbSet<LocalOptionValue> LocalOptionValues { get; set; } 
        public virtual DbSet<LocalOrganization> LocalOrganizations { get; set; } 
        public virtual DbSet<LocalOrganizationView> LocalOrganizationViews { get; set; }
		public virtual DbSet<LocalEmailTemplate> LocalEmailTemplates { get; set; }

		public virtual DbSet<LocalNation> LocalNations { get; set; }
		public virtual DbSet<LocalCountry> LocalCountries { get; set; }
		public virtual DbSet<LocalDistrict> LocalDistricts { get; set; }
		public virtual DbSet<LocalWard> LocalWards { get; set; }


		protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //throw new UnintentionalCodeFirstException();
        }
    }
}
