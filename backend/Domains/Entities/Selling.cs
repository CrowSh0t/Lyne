using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Selling
    {
        public required int id {  get; set; }
        public required int ProductID { get; set; }
        public required Products Product { get; set; }
        public required DateTime StartSelling { get; set; }
        public required DateTime EndSelling { get; set; }
    }
}
