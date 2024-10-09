/**
 * Este módulo contém a função {@link split}, para separação de sílabas (em português).
 * @module
 */
import alphabet from './alphabet.ts';

function isVowel(char: string) : boolean { return alphabet.foundOn(alphabet.VOWELS, char); }
function isAcuteVowel(char: string) : boolean { return alphabet.foundOn(alphabet.ACUTE_VOWELS, char); }
function isTildeVowel(char: string) : boolean { return alphabet.foundOn(alphabet.TILDE_VOWELS, char); }
function isConsonant(char: string) : boolean { return alphabet.foundOn(alphabet.CONSONANTS, char); }

function equalsTo(x: string, y1: string, y2: string) : boolean { return x === y1 || x === y2 };
function notEqualsTo(x: string, y1: string, y2: string) : boolean { return x !== y1 && x !== y2 };

function isValidPair(char: string, check: string) : boolean
{
	switch (check)
	{
		case 'r': case 'R':
			switch (char)
			{
				case 'l': case 'h': case 'j': case 'm': case 'n': case 'q':
				case 's': case 'r': case 'w': case 'x': case 'y': case 'z': case 'ç':
				case 'L': case 'H': case 'J': case 'M': case 'N': case 'Q':
				case 'S': case 'R': case 'W': case 'X': case 'Y': case 'Z': case 'Ç':
					return false;
				default: return true;
			}
			break;
		case 'h': case 'H':
			switch (char)
			{
				case 'l': case 'n': case 'c':
				case 'L': case 'N': case 'C':
					return true;
				default: return false;
			}
			break;
		default: return false;
	}
}

function postProcess(syllables: string[]) : void
{
	if (syllables.length > 1)
	{
		let previousLength = 0;
		let previousLast = '';

		for (let i = 1; i < syllables.length; i++)
		{
			previousLength = syllables[i - 1].length;
			previousLast = syllables[i - 1][previousLength - 1];

			if (((equalsTo(syllables[i][0], 'h', 'H') && isVowel(syllables[i][1])) || isVowel(syllables[i][0])) && isConsonant(previousLast))
			{
				syllables[i - 1] = syllables[i - 1].substring(0, previousLength - 1);
				syllables[i] = previousLast + syllables[i];
			}
			else if (syllables[i].length == 1)
			{
				if (isConsonant(syllables[i]))
				{
					if (isVowel(previousLast))
					{
						syllables[i - 1] += syllables[i];

						syllables.splice(i, 1);
					}
					else if (i + 1 < syllables.length - 1)
					{
						syllables[i + 1] += syllables[i];

						syllables.splice(i, 1);
					}
				}
				else if (equalsTo(previousLast, 'i', 'I') || equalsTo(previousLast, 'u', 'U'))
				{
					if (previousLength > 1 && isVowel(syllables[i - 1][previousLength - 2]))
					{
						syllables[i - 1] = syllables[i - 1].substring(0, previousLength - 1);
						syllables[i] = previousLast + syllables[i];
					}
					else
					{
						syllables[i - 1] += syllables[i];

						syllables.splice(i, 1);
					}
				}
			}
		}
	}
}

/**
* Separa as sílabas de uma palavra.
* @param input A palavra em si.
* @returns As sílabas. */
export default function split(input: string) : string[]
{
	const result = [''];
	let index = 0;

	const br = () =>
	{
		result.push('');

		index++;
	}

	for (let i = 0; i < input.length; i++)
	{
		if (input[i] === '-')
		{
			br();

			continue;
		}

		result[index] += input[i];

		if (result[index].length === 3) br();
		else if (isAcuteVowel(input[i])) br();
		else if (i < input.length - 1)
		{
			if (equalsTo(input[i + 1], 'r', 'R') && !isValidPair(input[i], 'r')) br();
			else if (equalsTo(input[i], 'h', 'H') && isVowel(input[i + 1]))
			{
				i++;
				result[index] += input[i];

				br();
			}
			else if (isTildeVowel(input[i]) && isVowel(input[i + 1]))
			{
				i++;
				result[index] += input[i];

				br();
			}
			else if (i + 1 < input.length - 1)
			{
				if (equalsTo(input[i], 'q', 'Q') && isVowel(input[i + 1]) && isVowel(input[i + 2]))
				{
					result[index] += input[i + 1];
					result[index] += input[i + 2];
					i += 2;

					br();
				}
				else if (equalsTo(input[i + 1], 'h', 'H') && isValidPair(input[i], 'h') && isVowel(input[i + 2]))
				{
					result[index] += input[i + 1];
					result[index] += input[i + 2];
					i += 2;

					br();
				}
				else if (equalsTo(input[i + 2], 'r', 'R') && isValidPair(input[i + 1], 'r'))
				{
					if (result[index].length > 1) br();

					i++;
					result[index] += input[i];
				}
				else if (notEqualsTo(input[i + 1], 'r', 'R') && isConsonant(input[i + 1]) && isVowel(input[i + 2])) br();
			}
			else if (isVowel(input[i]) && isVowel(input[i + 1])) br();
			else if (isConsonant(input[i]) && input[i] == input[i + 1]) br();
		}
	}

	if (result[index] == '') result.pop();

	postProcess(result);

	return result;
}
