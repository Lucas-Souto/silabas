const acuteVowels = "áéíóú";
const tildeVowels = "ãẽĩõũ";
const accentVowels = "àâäèêëìîïòôöùûü" + acuteVowels + tildeVowels;
const vowels = "aeiou" + accentVowels;
const consonants = "bcdfghjklmnpqrstvwxyzç";

export default
{
	ACUTE_VOWELS: 0, TILDE_VOWELS: 1, ACCENT_VOWELS: 2,
	VOWELS: 3, CONSONANTS: 4,

	LOWER_CASE:
	[
		acuteVowels, tildeVowels, accentVowels,
		vowels, consonants
	],
	UPPER_CASE:
	[
		acuteVowels.toUpperCase(), tildeVowels.toUpperCase(), accentVowels.toUpperCase(),
		vowels.toUpperCase(), consonants.toUpperCase()
	],

	foundOn: function(index: number, char: string) : boolean
	{
		for (let i = 0; i < this.LOWER_CASE[index].length; i++)
		{
			if (char === this.LOWER_CASE[index][i] || char === this.UPPER_CASE[index][i]) return true;
		}

		return false;
	}
};
