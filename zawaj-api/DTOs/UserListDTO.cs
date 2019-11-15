using System;
using System.Collections.Generic;
using X.PagedList;
using ZawajAPI.Helpers;
using ZawajAPI.Models;

namespace ZawajAPI.DTOs
{
    public class UserPagedListDTO{
        public IEnumerable<UserListDTO> Users { get; set; }
        public PagedList Pagination { get; set; }
        /* public int PageNumber { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public int TotalItemCount { get; set; } */
    }
    public class UserListDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string NickName { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string PhotoURL { get; set; }
        public bool? isLiking { get; set; }
    }
}