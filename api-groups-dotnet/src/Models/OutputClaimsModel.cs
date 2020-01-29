using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroupsApiB2C.Models
{
    public class OutputClaimsModel
    {
        // Demo: List of security groups the user is member of
        public List<string> groups { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
