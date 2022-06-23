const { yeah } = require('../..')
describe('vpin-test', () => {
    it('The show yeah!', () => {
        expect(yeah()).to.equal("yeah!")
    })
})
