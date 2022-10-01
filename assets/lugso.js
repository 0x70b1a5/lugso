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
    const maybeWord = map[word] || word
    if (maybeWord && maybeWord != '-') return maybeWord
    for (let key in map) {
        if (key.contains(word)) return map[key]
    }
    return 'NoWordFound:'+word
}

const glossify = async gloss => {
    const spreadsheet_id = '1w5AXgGZ8VKgCwW03Gdz1VmijRRQw0fJRSU8y4XvD28E'
    const doc = new GoogleSpreadsheet(spreadsheet_id)
    doc.useApiKey(process.env.GOOGLE_API_KEY)
    await doc.loadInfo()
    const dictSheet = doc.sheetsByIndex[0]
    const rows = await dictSheet.getRows()
    const glossMap = {}
    rows.forEach(row => {
        // this will overwrite duplicate parts of speech,
        // but preserve singletons (e.g. 1SG, 2SG)
        // so that glosses can use 'I' or '1SG'
        glossMap[row.english.trim()] = 
        glossMap[row.partOfSpeech.trim()] = 
            row.lugso.trim()
    })
    console.log(glossMap)

    return gloss.split(/\s/)
        .map(word => word.split('-')
            .map(w => getWord(w, glossMap))
            .join('-')
        ).join(' ');
}
// (async () => {
//     const g = 'consume-IMP flesh-ACC body-BEN 2SG-POSS'
//     const out = await glossify(g)
//     console.log(out) 
// })()
module.exports = {glossify, ipaify, latinate}