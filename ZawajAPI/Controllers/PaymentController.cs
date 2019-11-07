using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe;
using ZawajAPI.Data;
using ZawajAPI.DTOs;
using ZawajAPI.Helpers;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ZawajDbContext _context;
        private readonly IOptions<StripeSettings> _stripeSettings;

        public PaymentController(ZawajDbContext context, IOptions<StripeSettings> stripeSettings)
        {
            _context = context;
            _stripeSettings = stripeSettings;
        }

        // POST: api/Payment/charge
        [HttpPost("charge")]
        public async Task<IActionResult> Charge(PaymentChargeDTO paymentChargeDTO)
        {
            if (paymentChargeDTO.UserId != User.FindFirst(JwtRegisteredClaimNames.Jti).Value)
            { return Unauthorized(); }

            var customers = new CustomerService();
            var charges = new ChargeService();

            // var options = new TokenCreateOptions
            // {
            // Card = new CreditCardOptions
            //     {
            //         // Number = "4242424242424242",
            //         // ExpYear = 2020,
            //         // ExpMonth = 3,
            //         // Cvc = "123"
            //     }
            // };

            // var service = new TokenService();
            // Token stripeToken = service.Create(options);

            var customer = customers.Create(new CustomerCreateOptions
            {
                //SourceToken = stripeToken
                Source = paymentChargeDTO.StripeToken
            });

            var charge = charges.Create(new ChargeCreateOptions
            {
                Amount = 5000,
                Description = "إشتراك مدى الحياة",
                Currency = "usd",
                Customer = customer.Id
                //CustomerId = customer.Id
            });

            var payment = new Payment
            {
                PaymentDate = DateTime.Now,
                Amount = charge.Amount / 100,
                UserId = User.FindFirst(JwtRegisteredClaimNames.Jti).Value,
                ReceiptUrl = charge.ReceiptUrl,
                Description = charge.Description,
                Currency = charge.Currency,
                IsPaid = charge.Paid
            };
            _context.Payments.Add(payment);
            if (await _context.SaveChangesAsync() > 0)
            {
                return Ok(charge.Paid);
            }
            else
            {
                return BadRequest();
            }
        }

        // GET: api/Payment/id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaymentForUser(string id)
        {
            if (id != User.FindFirst(JwtRegisteredClaimNames.Jti).Value)
                return Unauthorized();
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.UserId == id);
            return Ok(payment);
        }
    }
}
