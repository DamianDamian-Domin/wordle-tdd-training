
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from '@/settings'
import { wrap } from 'module'

describe('WordleBoard', () => {
  let wordOfTheyDay = "TESTS"
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheyDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue(guess)
    await guessInput.trigger("keydown.enter")
  }

  describe("End of the game messages", () => {
    test('a victory message appears when the user makes a guess that matches the word of they day', async () => {
  
      await playerSubmitsGuess(wordOfTheyDay)
  
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  
    })
  
    describe.each([
      { numberOfGuesses: 0, shouldSeeDefeatMessage: false},
      { numberOfGuesses: 1, shouldSeeDefeatMessage: false},
      { numberOfGuesses: 2, shouldSeeDefeatMessage: false},
      { numberOfGuesses: 3, shouldSeeDefeatMessage: false},
      { numberOfGuesses: 4, shouldSeeDefeatMessage: false},
      { numberOfGuesses: 5, shouldSeeDefeatMessage: false},
      { numberOfGuesses: MAX_GUESSES_COUNT, shouldSeeDefeatMessage: true}
    ])(`a defeat message apperas if the player makes incorrect guesses ${MAX_GUESSES_COUNT} times`, async ({numberOfGuesses, shouldSeeDefeatMessage}) => {
  
        test(`therefore for ${numberOfGuesses} guess(es), a deafeat message should ${shouldSeeDefeatMessage ? "" : "not" } appear`, async() => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerSubmitsGuess("WRONG")
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
        {wordOfTheyDay: "FLY", reason: `word-of-they-day must have ${WORD_SIZE} characters`},
        {wordOfTheyDay: "test", reason: "word-of-they-day must be all in uppercase"},
        {wordOfTheyDay: "QQQQQ", reason: "word-of-they-day must be a valid English word"}
      ]
    )("Since $reason: $wordOfTheyDay is invalid therefore a warning must be emitted", async({wordOfTheyDay}) => {
  
      mount(WordleBoard, {props: {wordOfTheyDay}})
  
      expect(console.warn).toHaveBeenCalled()
  
    })
  
    test(`no warning is displayed if the word of the day is real word, all upercase and ${WORD_SIZE} characters long`, async() => {
  
    
      mount(WordleBoard, {props: {wordOfTheyDay: "TESTS"}})
    
      expect(console.warn).not.toHaveBeenCalled()
  
    })
  })

  describe("Player input", () => {

      test("remains in focus the entire time", async () => {
        document.body.innerHTML = `<div id="app"></div>`
        wrapper = mount(WordleBoard, {
            props: {wordOfTheyDay},
            attachTo: "#app"
        })

        expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined()

        await wrapper.find("input[type=text]").trigger("blur")
        expect(document.activeElement).toBe(wrapper.find("input[type=text]").element)
      })

      test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {

        await playerSubmitsGuess(wordOfTheyDay + "EXTRA")

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)

      })
      test("player guesses can only be submitted if they are real words", async () => {
        
        await playerSubmitsGuess("QWERT")

        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)

      })
      test("player guesses are not case-sensitive", async () => {
        
        await playerSubmitsGuess(wordOfTheyDay.toLocaleLowerCase())

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)

      })
      test("player guesses can only contain letters", async () => {
        
        await playerSubmitsGuess("H3!RT")

        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('HRT')

      })

      test("non-letter characters do not render on the screen while being typed", async() => {

        await playerSubmitsGuess("333")
        await playerSubmitsGuess("22")
        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')

      })

  })


})
