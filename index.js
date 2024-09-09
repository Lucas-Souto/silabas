const test = "pessoa,teste,sol,palavra,empreender,preço,carro,taxi,choro,hora,otorrinolaringologista,octeto,principal,principio,ideia,pague,quindim,caqui,quando".split(',');
const vog = 'aeiouáàéíóúâôãõ';
const con = 'bcdfghjklmnpqrstvwxyzç';

function isCon(char) { return con.indexOf(char) != -1; }
function isVog(char) { return vog.indexOf(char) != -1; }

function validRPair(char)
{
    switch (char)
    {
        case 'l': case 'h': case 'j': case 'm': case 'n': case 'q': case 's': case 'r': case 'w': case 'x': case 'y': case 'z': case 'ç': return false;
        default: return true;
    }
}

function validHPair(char)
{
    switch (char)
    {
        case 'l': case 'n': case 'c': return true;
        default: return false;
    }
}

function postProccess(syllables)
{
    if (syllables.length > 1)
    {
        for (let i = 1; i < syllables.length; i++)
        {
			const previousLen = syllables[i - 1].length;
            const previousLast = syllables[i - 1][previousLen - 1];
            
            if (isVog(syllables[i][0]) && isCon(previousLast))
            {
                syllables[i - 1] = syllables[i - 1].substring(0, previousLen - 1);
                syllables[i] = previousLast + syllables[i];
            }
            else if (syllables[i].length == 1)
            {
				if (isCon(syllables[i]))
				{
					if (isVog(previousLast))
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
                else if (previousLast == 'i' || previousLast == 'í' || previousLast == 'u')
				{
					if (previousLen > 1 && isVog(syllables[i - 1][previousLen - 2]))
					{
						syllables[i - 1] = syllables[i - 1].substring(0, previousLen - 1);
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

function proccess(input)
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
        result[index] += input[i];

        if (result[index].length == 3) br();
        else if (i < input.length - 1)
        {
            if (input[i + 1] == 'r' && !validRPair(input[i])) br();
            else if (input[i] == 'h' && isVog(input[i + 1]))
            {
                i++;
                result[index] += input[i];

                br();
            }
            else if (i + 1 < input.length - 1)
            {
                if (input[i + 1] == 'h' && validHPair(input[i]) && isVog(input[i + 2]))
                {
                    result[index] += input[i + 1];
                    result[index] += input[i + 2];
                    i += 2;

                    br();
                }
                else if (input[i + 2] == 'r' && validRPair(input[i + 1]))
                {
                    if (result[index].length > 1) br();

                    i++;
                    result[index] += input[i];
                }
                else if (input[i + 1] != 'r' && isCon(input[i + 1]) && isVog(input[i + 2])) br();
            }
            else if (isVog(input[i]) && isVog(input[i + 1])) br();
            else if (isCon(input[i]) && input[i] == input[i + 1]) br();
        }
    }

    if (result[index] == '') result.pop();

    postProccess(result);
  
  	return [input, result];
}

for (let i = 0; i < test.length; i++) test[i] = proccess(test[i]);

for (let i = 0; i < test.length; i++) console.log(`${test[i][0]} (${test[i][1].length}): ${test[i][1].join(', ')}`);
