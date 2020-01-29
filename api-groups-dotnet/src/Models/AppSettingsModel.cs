using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroupsApiB2C.Models
{
    public class AppSettingsModel
    {
        public string Tenant { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
