
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'

describe('WordleBoard', () => {
  test('a victory message appears when the user makes a guess that matches the word of they day', async () => {

    // Arange
    const wrapper = mount(WordleBoard, { props: { worldOfTheyDay: 'TESTS' } })

    // Act

    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("TESTS")
    await guessInput.trigger("keydown.enter")

    // Assert

    expect(wrapper.text()).toContain("You won!")

  })
})
