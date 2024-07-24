
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE } from '@/settings'

describe('WordleBoard', () => {
  test('a victory message appears when the user makes a guess that matches the word of they day', async () => {

    const wrapper = mount(WordleBoard, { props: { worldOfTheyDay: 'TESTS' } })

    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("TESTS")
    await guessInput.trigger("keydown.enter")

    expect(wrapper.text()).toContain(VICTORY_MESSAGE)

  })
})
