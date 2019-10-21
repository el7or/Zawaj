namespace ZawajAPI.Helpers
{
    public class SearchParams
    {
        public int Gender { get; set; } = 0;
        public int MinAge { get; set; } = 14;
        public int MaxAge { get; set; } = 99;
        public string OrderBy { get; set; } = "lastActive";
    }
}