// Use IIFE to avoid polluting global scope (Anki web)
(() => {
  const TONE_COLOR = {
    FIRST: 'red',
    SECOND: 'blue',
    THIRD: 'purple',
    FOURTH: 'violet',
    FIFTH: 'lightgrey'
  }
  const TONE_COLOR_TO_VOWELS = {
    [TONE_COLOR.FIRST]: ['ā','ē','ī','ō','ū','ǖ'],
    [TONE_COLOR.SECOND]: ['á','é','í','ó','ú','ǘ'],
    [TONE_COLOR.THIRD]: ['ǎ','ě','ǐ','ǒ','ǔ','ǚ'],
    [TONE_COLOR.FOURTH]: ['à','è','ì','ò','ù','ǜ']
  }

  const hanziElt = document.querySelector('.hanzi')
  const pinyinElt = document.querySelector('.pinyin')
  const exampleElt = document.querySelector('.example')
  const debugElt = document.querySelector('.debug')

  const hanzi = hanziElt.textContent.trim()
  const pinyin = pinyinElt.textContent.trim()
  const example = exampleElt.textContent.trim()

  const colorizeStrTmpl = (color, str) => `<span class="emphasize" style="color:${color}">${str}</span>`
    
  function showError(msg) {
    debugElt.innerHTML = `<div class="text">${msg}</div>`
  }

  function getColorizedPinyinAndHanziTmpl() {
    var curChar, found, hanziIdx = 0 // helpers
    var pinyinTmpl = '', hanziTmpl = ''
    for (var i = 0; i < pinyin.length; ++i) { // loop over the current pinyin word
      found = false
      curChar = pinyin[i]
      for (const toneColor in TONE_COLOR_TO_VOWELS) {
        if (TONE_COLOR_TO_VOWELS[toneColor].includes(curChar)) { // tone vowel exists in the word
          pinyinTmpl += colorizeStrTmpl(toneColor, curChar) // map tone color to vowel
          if (!hanzi[hanziIdx]) {// idx of the hanzi does not exists
            throw new Error('Index of the hanzi does not exist')
          }
          hanziTmpl += colorizeStrTmpl(toneColor, hanzi[hanziIdx]) // map tone color to hanzi idx
          hanziIdx++
          found = true
        }
      }
      if (!found) pinyinTmpl += curChar
    }
    while (hanziIdx < hanzi.length) {
      // Set remaining hanzi characters to neutral tone
      hanziTmpl += colorizeStrTmpl(TONE_COLOR.FIFTH, hanzi[hanziIdx])
      hanziIdx++
    }
    return { pinyinTmpl, hanziTmpl }
  }

  function colorizeExample(hanziTmpl) {
    if (!example) {
      exampleElt.innerHTML = '<span class="no-example">No example provided</span>'
    }
    else if (example.includes(hanzi)) {
      exampleElt.innerHTML = example.replace(hanzi, hanziTmpl)
    } else {
      showError(`Cannot find ${hanzi} in the example`)
    }
  }


  try {
    const { pinyinTmpl, hanziTmpl } = getColorizedPinyinAndHanziTmpl()
    hanziElt.innerHTML = hanziTmpl
    pinyinElt.innerHTML = pinyinTmpl
    colorizeExample(hanziTmpl)
  } catch (err) {
    showError(err ? err.message : 'Something failed')
  }
})()

