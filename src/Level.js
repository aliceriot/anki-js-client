import React, { useState, useEffect } from "react"

import Kanji from "./Kanji"
import Vocab from "./Vocab"

import db from "./db"

const percentage = (learned, toLearn) =>
  Math.floor(
    (learned / toLearn) * 100
  )

export default function Level(props) {
  const { level } = props

  const [expanded, setExpanded] = useState(false)

  const [kanji, setKanji] = useState(null)
  const [vocab, setVocab] = useState(null)
  const [kanjiLearned, setKanjiLearned] = useState(null)
  const [vocabLearned, setVocabLearned] = useState(null)

  useEffect(() => {
    const foo = async () => {
      if (expanded) {
        const kanji = await db.kanji
          .where("level")
          .equals(level)
          .toArray()
        setKanji(kanji)

        const kanjiLearned = await db.kanji
          .where("level")
          .equals(level)
          .and(kanji => kanji.interval_avg !== 0)
          .count()
        setKanjiLearned(kanjiLearned)

        const vocab = await db.vocab
          .where("level")
          .equals(level)
          .toArray()
        setVocab(vocab)

        const vocabLearned = await db.vocab
          .where("level")
          .equals(level)
          .and(vocab => vocab.interval_avg !== 0)
          .count()
        setVocabLearned(vocabLearned)
      }
    }
    foo()
  }, [expanded, level])

  return (
    <div className="level">
      <div className="level-header">
        <div class="level-name" onClick={() => setExpanded(!expanded)}>
          {level}
        </div>
        {expanded ? (
          <div class="refresh">
            リフレッシュ
          </div>
        ) : null}
      </div>
      {expanded ? (
        <div className="level">
          <div className="sub-level-heading">
            <h3>漢字</h3>
            {kanjiLearned ? (
              <div className="num-learned">
                {kanjiLearned} / {kanji.length}
              </div>
            ) : null}
          </div>
          { kanjiLearned ? (
            <div className="progress">
              <div className="progress-background">
                <div style={{ width: `${percentage(kanjiLearned, kanji.length)}%` }} className="progress-indicator" />
              </div>
            </div>
          ) : null }
          {kanji ? (
            <div className="kanjis">
              {kanji.map(kanji => (
                <Kanji kanji={kanji} key={kanji.kanji} />
              ))}
            </div>
          ) : null}
          <div className="sub-level-heading">
            <h3>語彙</h3>
            {vocabLearned ? (
              <div className="num-learned">
                {vocabLearned} / {vocab.length}
              </div>
            ) : null}
          </div>
          { vocabLearned ? (
            <div className="progress">
              <div className="progress-background">
                <div style={{ width: `${percentage(vocabLearned, vocab.length)}%` }} className="progress-indicator" />
              </div>
            </div>
          ) : null }
          {vocab ? (
            <div className="vocabs">
              {vocab.map(vocab => (
                <Vocab vocab={vocab} key={vocab.vocab} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
