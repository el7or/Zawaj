using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Models;

namespace ZawajAPI.Data
{
    public class ZawajDbContext : IdentityDbContext<
        User, Role, string,
        IdentityUserClaim<string>, UserRole, IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public ZawajDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(
                userRole =>
                {
                    userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                    userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                    userRole.HasOne(ur => ur.User)
                   .WithMany(r => r.UserRoles)
                   .HasForeignKey(ur => ur.UserId)
                   .IsRequired();
                }
            );

            modelBuilder.Entity<Like>(
                like =>
                {
                    like.HasKey(k => new { k.LikeFromUserId, k.LikeToUserId });

                    like.HasOne(l => l.LikeFromUser)
                    .WithMany(u => u.LikesTo)
                    .HasForeignKey(l => l.LikeFromUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                    like.HasOne(l => l.LikeToUser)
                    .WithMany(u => u.LikesFrom)
                    .HasForeignKey(l => l.LikeToUserId)
                    .OnDelete(DeleteBehavior.Restrict);
                }
            );

            /* modelBuilder.Entity<Like>()
            .HasKey(k=>new {k.LikeFromUserId,k.LikeToUserId});

            modelBuilder.Entity<Like>()
            .HasOne(l=>l.LikeFromUser)
            .WithMany(u=>u.LikesTo)
            .HasForeignKey(l=>l.LikeFromUserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>()
            .HasOne(l=>l.LikeToUser)
            .WithMany(u=>u.LikesFrom)
            .HasForeignKey(l=>l.LikeToUserId)
            .OnDelete(DeleteBehavior.Restrict); */
        }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Like { get; set; }
    }
}