const acuteVowels = "áéíóú";
const tildeVowels = "ãẽĩõũ";
const accentVowels = "àâäèêëìîïòôöùûü" + acuteVowels + tildeVowels;
const vowels = "aeiou" + accentVowels;
const consonants = "bcdfghjklmnpqrstvwxyzç";

function isVowel(char: string) : boolean { return vowels.indexOf(char) != -1; }
function isAcuteVowel(char: string) : boolean { return acuteVowels.indexOf(char) != -1; }
function isTildeVowel(char: string) : boolean { return tildeVowels.indexOf(char) != -1; }
function isAccentVowel(char: string) : boolean { return accentVowels.indexOf(char) != -1; }
function isConsonant(char: string) : boolean { return consonants.indexOf(char) != -1; }

function isValidPair(char: string, check: string) : boolean
{
	switch (check)
	{
		case 'r':
			switch (char)
			{
				case 'l': case 'h': case 'j': case 'm': case 'n': case 'q':
				case 's': case 'r': case 'w': case 'x': case 'y': case 'z': case 'ç': return false;
				default: return true;
			}
			break;
		case 'h':
			switch (char)
			{
				case 'l': case 'n': case 'c': return true;
				default: return false;
			}
			break;
	}

	return false;
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

			if (isVowel(syllables[i][0]) && isConsonant(previousLast))
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
                else if (previousLast == 'i' || previousLast == 'u')
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

export function split(input: string) : string[]
{
	input = input.toLowerCase();
	const result = [''];
  	let index = 0;

    const br = () =>
    {
        result.push('');

        index++;
    }

  	for (let i = 0; i < input.length; i++)
    {
		if (input[i] == '-')
		{
			br();

			continue;
		}

        result[index] += input[i];

        if (result[index].length == 3) br();
		else if (isAcuteVowel(input[i])) br();
        else if (i < input.length - 1)
        {
            if (input[i + 1] == 'r' && !isValidPair(input[i], 'r')) br();
            else if (input[i] == 'h' && isVowel(input[i + 1]))
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
				if (input[i] == 'q' && isVowel(input[i + 1]) && isVowel(input[i + 2]))
				{
					result[index] += input[i + 1];
                    result[index] += input[i + 2];
                    i += 2;

                    br();
				}
                else if (input[i + 1] == 'h' && isValidPair(input[i], 'h') && isVowel(input[i + 2]))
                {
                    result[index] += input[i + 1];
                    result[index] += input[i + 2];
                    i += 2;

                    br();
                }
                else if (input[i + 2] == 'r' && isValidPair(input[i + 1], 'r'))
                {
                    if (result[index].length > 1) br();

                    i++;
                    result[index] += input[i];
                }
                else if (input[i + 1] != 'r' && isConsonant(input[i + 1]) && isVowel(input[i + 2])) br();
            }
            else if (isVowel(input[i]) && isVowel(input[i + 1])) br();
            else if (isConsonant(input[i]) && input[i] == input[i + 1]) br();
        }
    }

    if (result[index] == '') result.pop();

    postProcess(result);
  
  	return result;
}
