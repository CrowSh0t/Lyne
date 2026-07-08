using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Color
{
    public class ColorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? HexCode { get; set; }
    }

    public class CreateColorDto
    {
        public string Name { get; set; }
        public string? HexCode { get; set; }
    }
}
