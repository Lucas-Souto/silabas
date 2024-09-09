import { split } from "./mod.ts";
import { assertEquals } from "jsr:@std/assert@1";

Deno.test("Separação silábica", () =>
{
	const input =
	[
		"pessoa", "teste", "sol", "palavra", "empreender", "preço",
		"carro", "taxi", "choro", "hora", "otorrinolaringologista",
		"octeto", "principal", "princípio", "ideia", "pague", "quindim",
		"caqui", "quando", "paquera", "arco-íris", "íamos", "não", "alemão"
	];
	const expected =
	[
		["pes", "so", "a"], ["tes", "te"], ["sol"], ["pa", "la", "vra"], ["em", "pre", "en", "der"], ["pre", "ço"],
		["car", "ro"], ["ta", "xi"], ["cho", "ro"], ["ho", "ra"], ["o", "tor", "ri", "no", "la", "rin", "go", "lo", "gis", "ta"],
		["oc", "te", "to"], ["prin", "ci", "pal"], ["prin", "cí", "pio"], ["i", "de", "ia"],  ["pa", "gue"], ["quin", "dim"],
		["ca", "qui"], ["quan", "do"], ["pa", "que", "ra"], ["ar", "co", "í", "ris"], ["í", "a", "mos"], ["não"], ["a", "le", "mão"]
	];

	for (let i = 0; i < input.length; i++)
	{
		const result = split(input[i]);

		assertEquals(result, expected[i]);
	}
});
