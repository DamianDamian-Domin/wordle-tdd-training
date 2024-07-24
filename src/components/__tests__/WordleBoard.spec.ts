
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings'
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
  
    test('a defeat message apperas if the user makes a guess that is incorrect', async () => {
  
      await playerSubmitsGuess("WRONG")
  
      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  
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
      test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {

        await playerSubmitsGuess(wordOfTheyDay + "EXTRA")

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)

      })
      test("player guesses can only be submitted if they are real words", async () => {
        
        await playerSubmitsGuess("QWERT")

        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)

      })
      test.todo("player guesses are not case-sensitive")
      test.todo("player guesses can only contain letters")
  })


})
