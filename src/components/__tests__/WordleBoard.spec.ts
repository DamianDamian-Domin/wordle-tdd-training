
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'

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
    test.each(
      [
        {wordOfTheyDay: "FLY", reason: "word-of-they-day must have 5 characters"},
        {wordOfTheyDay: "tests", reason: "word-of-they-day must be all in uppercase"},
        {wordOfTheyDay: "QQQQQQ", reason: "word-of-they-day must be a valid English word"}
      ]
    )("Since $reason: $wordOfTheyDay is invalid therefore a warning must be emitted", async({wordOfTheyDay}) => {
      console.warn = vi.fn()
  
      mount(WordleBoard, {props: {wordOfTheyDay}})
  
      expect(console.warn).toHaveBeenCalled()
  
    })
  
    test("no warning is displayed if the word of the day is real word, all upercase and 5 characters long", async() => {
  
      console.warn = vi.fn()
    
      mount(WordleBoard, {props: {wordOfTheyDay: "TESTS"}})
    
      expect(console.warn).not.toHaveBeenCalled()
  
    })
  })

  describe("Player input", () => {
      test.todo("player guesses are limited to 5 letters")
      test.todo("player guesses can only be submitted if they are real words")
      test.todo("player guesses are not case-sensitive")
      test.todo("player guesses can only contain letters")
  })


})
