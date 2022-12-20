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
    'd':'ð',
    '5':'ʃ',
    '3':'ʒ',
    'l':'ɮ',
    'x':'x',
    'g':'ɣ',
    'h':'χ',
    'y':'j',
    'r':'ɻ',
    "'":'ʔ',
};

const speak = (s, btnOnly) => `<span class='spoken ${btnOnly ? 'btnOnly' 
    : ''}'> <button class='speak' type='button' data-ipa='${s}'>🔈</button> ${btnOnly ? '' 
    : `<span class='ipa'>${s}</span>`} </span>`

const ipaify = (str, html) => {
    const s = str 
        ? str.split(' ').map(word => word.split('')
            .map(char => ipamap[char] || char)
            .join(''))
            .map(ipaWord => {
                // only the first syllable is stressed
                // convert all ʌ after the first vowel into ə
                const w = ipaWord.split('')
                let l = ''
                let firstVowel = false
                for (let i = 0; i < w.length; i++) {
                    if (firstVowel && w[i] == 'ʌ') {
                        l += 'ə'
                    } else {
                        l += w[i]
                    }
                    if (w[i].match(/[uiʌ]/)) {
                        firstVowel = true
                    }
                }
                return l
            })
        .join(' ')
        : ''
    if (!s || s == '-') return ''
    return html ? speak(s) : s
}

const latinate = str => {
    return str.split('').map(char => Object.keys(ipamap).find(key => ipamap[key] == char)).join('');
}
// const col = `gi pobblzot kbitkplzot lukgu!` // paste LATIN text here
// const splitcol=col.split('\n');
// const ipacol = splitcol.map(ipaify).join('\n')

const dig = (word, map, wholeRow) => {
    // words with notes of the pattern 'see X' should furnish X
    const notes = map[word+'_notes']
    if (!notes) return ''

    const redirect = notes.match(/^see (.*)/)
    // -> ['see xyz', 'xyz', index: 4, input: 'see xyz', groups: undefined]
    if (redirect && redirect[1]) {
        const eng = redirect[1]
        // TODO can't redirect to a compound
        const lugso = map[eng]
        if (lugso && lugso != '-') {
            return wholeRow ? {
                lugso,
                english: eng,
                partOfSpeech: map[eng+'_pos'] || eng,
                notes: map[eng+'_notes'] || ''
            } : lugso
        } else if (lugso == '-') {
            // console.log('RECURSION: ', eng)
            return dig(eng, map, wholeRow)
        }
    }

    const pos = map[word+'_pos']
    const isCompound = pos && pos.includes('compound')
    if (isCompound) {
        const lugso = notes.split(/[- ]/)
            .map(subWord => getWord(subWord, map))
            .join(pos.includes('*') ? '' : '-')
        return wholeRow ? {
            lugso,
            notes,
            english: word,
            partOfSpeech: map[word+'_pos'],
        } : lugso
    }

    return ''
}

// turns gloss into lugso
const getWord = (word, map, wholeRow) => {
    if (!word) return '-'

    const w = map[word]
    if (w && w != '-') return wholeRow ? {
        english: word,
        lugso: w,
        partOfSpeech: map[word+'_pos'] || word,
        notes: map[word+'_notes'] || ''
    } : w

    const dug = dig(word, map, wholeRow)
    if (dug) return dug

    // otherwise, guess based on includes
    for (let key in map) {
        if (key.includes(word)) return wholeRow ? {
            english: word,
            lugso: map[key],
            partOfSpeech: map[key+'_pos'] || word,
            notes: map[key+'_notes'] || ''
        } : map[key]
    }

    throw `Word ${word} not found`
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

const rowsToMap = rows => {
    const glossMap = {}
    rows.forEach(row => {
        // this will overwrite duplicate parts of speech,
        // but preserve singletons (e.g. 1SG, 2SG)
        // so that glosses can use 'I' or '1SG'
        const l = row.lugso.trim()
        const e = row.english.trim()
        const p = row.partOfSpeech.trim()
        const i = ipaify(row.lugso)
        glossMap[e] = l
        glossMap[e+'_notes'] = row.notes ? row.notes.trim() : undefined
        glossMap[e+'_pos'] = p
        glossMap[e+'_ipa'] = i
        if (l != '-') glossMap[p] = l
    })
    return glossMap
}

const phonotact = word => word.replace(/(\w)(\W?)(\1)/g, "$1$2'$3")
    .replace(/([iuo])(\W?)([iuo])/g, "$1$2'$3")

const glossToLugso = (gloss, map) => gloss.split(/\s+/)
    .map(word => word.split('-')
        .map(w => getWord(w, map)+'\u0323')
        .join('')
    )
    .map(word => phonotact(word))
    .join(' ');
// (async () => {
//     const g = `lead-NMLZ.DER.agent 2SG-POSS 1SG
// death 2SG-POSS distant-NEG
// strong-NMLZ.DER 2SG-POSS deity-PL
// IMP bless-ADJ.DER
// flesh 2SG-POSS weak CONJ.but weird-NMLZ.DER strong`
//     const out = (await Promise.all(g.split('\n').map(async h => await glossify(h)))).join('\n')
//     console.log(out) 
// })()
module.exports = { glossToLugso, ipaify, latinate, getSheet, rowsToMap, getWord, speak, phonotact }