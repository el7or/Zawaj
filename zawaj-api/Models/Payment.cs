using System;
using System.ComponentModel.DataAnnotations;

namespace ZawajAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; } 
        public DateTime PaymentDate {get; set;}
        public double Amount { get; set; } 
        public string UserId { get; set; } 
        public string ReceiptUrl { get; set; } 
        public string Description  { get; set; }
        public string Currency  { get; set; }
        public bool IsPaid { get; set; }
    }
}