
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from '@/settings'
import { wrap } from 'module'
import exp from 'constants'

describe('WordleBoard', () => {
  let wordOfTheDay = "TESTS"
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })


  async function playerTypesAndSubmitsGuess(guess: string) {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  async function playerTypesGuess(guess: string) {
    await wrapper.find("input[type=text]").setValue(guess)
  }

  async function playerPressesEnter() {
    await wrapper.find("input[type=text]").trigger("keydown.enter")
  }

  describe("End of the game messages", () => {
    test('a victory message appears when the user makes a guess that matches the word of they day', async () => {
  
      await playerTypesAndSubmitsGuess(wordOfTheDay)
  
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  
    })
  
    describe.each(
      Array.from(
        {length: MAX_GUESSES_COUNT + 1},
        (_, numberOfGuesses) => ({
          numberOfGuesses,
          shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT
        })
      )
    )(`a defeat message apperas if the player makes incorrect guesses ${MAX_GUESSES_COUNT} times`, ({numberOfGuesses, shouldSeeDefeatMessage}) => {
  
        test(`therefore for ${numberOfGuesses} guess(es), a deafeat message should ${shouldSeeDefeatMessage ? "" : "not" } appear`, async() => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerTypesAndSubmitsGuess("WRONG")
          }

          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
          }


      })
  
    })
  
    test("no end of game message appears if the user has not yet made a guess", async () => {
  
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe("Rules of defining the word of they day", () => {

    beforeEach(() => {
      console.warn = vi.fn()
    })

    test.each(
      [
        {wordOfTheDay: "FLY", reason: `word-of-they-day must have ${WORD_SIZE} characters`},
        {wordOfTheDay: "test", reason: "word-of-they-day must be all in uppercase"},
        {wordOfTheDay: "QQQQQ", reason: "word-of-they-day must be a valid English word"}
      ]
    )("Since $reason: $wordOfTheDay is invalid therefore a warning must be emitted", async({wordOfTheDay}) => {
  
      mount(WordleBoard, {props: {wordOfTheDay}})
  
      expect(console.warn).toHaveBeenCalled()
  
    })
  
    test(`no warning is displayed if the word of the day is real word, all upercase and ${WORD_SIZE} characters long`, async() => {
  
    
      mount(WordleBoard, {props: {wordOfTheDay: "TESTS"}})
    
      expect(console.warn).not.toHaveBeenCalled()
  
    })
  })

  describe("Player input", () => {
    
      test('the input gets cleared after each submission', async() => {

        await playerTypesAndSubmitsGuess("CODER")

        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')

      })

      test("remains in focus the entire time", async () => {
        document.body.innerHTML = `<div id="app"></div>`
        wrapper = mount(WordleBoard, {
            props: {wordOfTheDay},
            attachTo: "#app"
        })

        expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined()

        await wrapper.find("input[type=text]").trigger("blur")
        expect(document.activeElement).toBe(wrapper.find("input[type=text]").element)
      })

      test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {

        await playerTypesAndSubmitsGuess(wordOfTheDay + "EXTRA")

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)

      })
      test("player guesses can only be submitted if they are real words", async () => {
        
        await playerTypesAndSubmitsGuess("QWERT")

        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)

      })
      test("player guesses are not case-sensitive", async () => {
        
        await playerTypesAndSubmitsGuess(wordOfTheDay.toLocaleLowerCase())

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)

      })
      test("player guesses can only contain letters", async () => {
        
        await playerTypesGuess("H3!RT")

        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('HRT')

      })

      test("non-letter characters do not render on the screen while being typed", async() => {

        await playerTypesGuess("333")
        await playerTypesGuess("22")
        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')

      })

      test("player shall not have possibility to guess anymore when game is over - win", async() => {

        await playerTypesAndSubmitsGuess(wordOfTheDay)

        expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()

        
      })

      test("player shall not have possibility to guess anymore when game is over - lose", async() => {

        const guesses = [
          "WRONG",
          "GUESS",
          "HELLO",
          "WORLD",
          "HAPPY",
          "CODER",
        ]
    
        for (const guess of guesses) {
          await playerTypesAndSubmitsGuess(guess)
        }

        expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
        
      })

  })

  test("All previous guesses doone by the player are visible in the page", async() => {
    const guesses = [
      "WRONG",
      "GUESS",
      "HELLO",
      "WORLD",
      "HAPPY",
      "CODER"
    ]

    for (const guess of guesses) {
      await playerTypesAndSubmitsGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }

  })

  describe("Displaying hints/feedback to the player", () => {
    test("hints are not displayed until the player submits their guess", async() => {
      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was being rendered before the player started typing guess").toBe(false)

      await playerTypesGuess(wordOfTheDay)

      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was being rendered while player typing guess").toBe(false)

      await playerPressesEnter()

      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was not rendered when player submitted their guess").toBe(true)

    })
  })

  describe.each([
    {
        position: 0,
        expectedFeedback: "correct",
        reason: "W is the first letter of 'WORLD' and 'WRONG'"
    },
    {
        position: 1,
        expectedFeedback: "almost",
        reason: "R exists in both words, but it is in position '2' of 'WORLD'"
    },
    {
        position: 2,
        expectedFeedback: "almost",
        reason: "O exists in both words, but it is in position '1' of 'WORLD'"
    },
    {
        position: 3,
        expectedFeedback: "incorrect",
        reason: "N does not exist in 'WORLD'"
    },
    {
        position: 4,
        expectedFeedback: "incorrect",
        reason: "G does not exist in 'WORLD'"
    }
])("If the word of the day is 'WORLD' and the player types 'WRONG'", ({position, expectedFeedback, reason}) => {
    const wordOfTheDay = "WORLD"
    const playerGuess = "WRONG"

    test(`the feedback for '${playerGuess[position]}' (index: ${position}) should be '${expectedFeedback}' because '${reason}'`, async () => {
        wrapper = mount(WordleBoard, {propsData: {wordOfTheDay}})

        await playerTypesAndSubmitsGuess(playerGuess)

        const actualFeedback = wrapper.findAll("[data-letter]").at(position)?.attributes("data-letter-feedback")

        expect(actualFeedback).toEqual(expectedFeedback)
    })
})

})
