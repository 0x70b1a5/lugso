require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet');

// turns latin text into IPA
const ipamap = {
    'a':'ʌ',
    'e':'ʌ',
    'o':'ʌ',
    'b':'β',
    'p':'ɸ',
    't':'θ',
    'n':'ð',
    'S':'ʃ',
    'Z':'ʒ',
    'l':'ɮ',
    'k':'x',
    'g':'ɣ',
    'h':'χ',
    'y':'j',
    'r':'ɻ'
};
const ipaify = str => {
    return str.split('').map(char => ipamap[char] || char).join('');
}
const latinate = str => {
    return str.split('').map(char => Object.keys(ipamap).find(key => ipamap[key] == char)).join('');
}
// const col = `gi pobblzot kbitkplzot lukgu!` // paste LATIN text here
// const splitcol=col.split('\n');
// const ipacol = splitcol.map(ipaify).join('\n')


// turns gloss into lugso
const getWord = (word, map) => {
    const w = map[word] || word
    if (w && w != '-') return w

    // words with notes of the pattern 'see X' should furnish X
    const notes = map[word+'_notes']
    if (notes) {
        const redirect = notes.match(/^see (.*)/)
        // -> ['see xyz', 'xyz', index: 4, input: 'see xyz', groups: undefined]
        if (redirect && redirect[1]) {
            const dest = map[redirect[1]]
            if (dest) return dest
        }
    }

    // otherwise, guess based on includes
    for (let key in map) {
        if (key.includes(word)) return map[key]
    }

    return 'NoWordFound:"'+word+'"'
}

const getSheet = async () => {
    const spreadsheet_id = '1w5AXgGZ8VKgCwW03Gdz1VmijRRQw0fJRSU8y4XvD28E'
    const doc = new GoogleSpreadsheet(spreadsheet_id)
    doc.useApiKey(process.env.GOOGLE_API_KEY)
    await doc.loadInfo()
    const dictSheet = doc.sheetsByIndex[0]
    const rows = await dictSheet.getRows()
    return rows
}

const glossToLugso = (gloss, rows) => {
    const glossMap = {}
    rows.forEach(row => {
        // this will overwrite duplicate parts of speech,
        // but preserve singletons (e.g. 1SG, 2SG)
        // so that glosses can use 'I' or '1SG'
        const l = row.lugso.trim()
        const e = row.english.trim()
        const p = row.partOfSpeech.trim()
        glossMap[e] = l
        glossMap[e+'_notes'] = row.notes ? row.notes.trim() : undefined
        if (l != '-') glossMap[p] = l
    })
    // console.log(glossMap)

    return gloss.split(/\s+/)
        .map(word => word.split('-')
            .map(w => getWord(w, glossMap))
            .join('-')
        ).join(' ');
}
// (async () => {
//     const g = `lead-NMLZ.DER.agent 2SG-POSS 1SG
// death 2SG-POSS distant-NEG
// strong-NMLZ.DER 2SG-POSS deity-PL
// IMP bless-ADJ.DER
// flesh 2SG-POSS weak CONJ.but weird-NMLZ.DER strong`
//     const out = (await Promise.all(g.split('\n').map(async h => await glossify(h)))).join('\n')
//     console.log(out) 
// })()
module.exports = { glossToLugso, ipaify, latinate, getSheet }