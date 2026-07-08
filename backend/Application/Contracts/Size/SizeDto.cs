using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Size
{
    public class SizeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateSizeDto
    {
        public string Name { get; set; }
    }
}
