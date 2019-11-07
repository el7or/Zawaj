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

            modelBuilder.Entity<Message>(
                msg =>
                {
                    msg.HasOne(l => l.Sender)
                    .WithMany(u => u.MessagesSent)
                    .HasForeignKey(l => l.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                    msg.HasOne(l => l.Receiver)
                    .WithMany(u => u.MessagesReceived)
                    .HasForeignKey(l => l.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);
                }
            );
        }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Payment> Payments { get; set; }
    }
}