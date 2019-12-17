import {
    findTagsInObjectURL,
    findTagsInBuffer,
    base64ToArrayBuffer,
} from '../../src/input/exif_helper';


const fixtures = {
    orientation: {
        'none': 'data:image/jpeg;base64,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',
        '6': 'data:image/jpeg;base64,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',
        '3': 'data:image/jpeg;base64,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',
        '8': 'data:image/jpeg;base64,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',
        '1': 'data:image/jpeg;base64,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',
    },
};

describe('exif_helper', () => {
    describe('findTagsInObjectURL', () => {
        it('should return null if the src type is not supported', (done) => {
            findTagsInObjectURL('blabla').then(tags => {
                expect(tags === null).to.equal(true);
                done();
            });
        });

        it('should fail for a invalid blob type', (done) => {
            findTagsInObjectURL('blob:balbla')
                .then(() => {})
                .catch(err => {
                    console.log(err);
                    expect(typeof err !== 'undefined');
                }).then(done);
        });
    });

    describe('findTagsInBuffer', () => {
        it('should result in a rotation value of 1', () => {
            const result = findTagsInBuffer(base64ToArrayBuffer(fixtures.orientation['1']));
            expect(result).to.deep.equal({orientation: 1});
        });
        it('should result in a rotation value of 6', () => {
            const result = findTagsInBuffer(base64ToArrayBuffer(fixtures.orientation['6']));
            expect(result).to.deep.equal({orientation: 6});
        });
        it('should result in a rotation value of 3', () => {
            const result = findTagsInBuffer(base64ToArrayBuffer(fixtures.orientation['3']));
            expect(result).to.deep.equal({orientation: 3});
        });
        it('should result in a rotation value of 4', () => {
            const result = findTagsInBuffer(base64ToArrayBuffer(fixtures.orientation['8']));
            expect(result).to.deep.equal({orientation: 8});
        });
        it('should return nothing if orientation is not found', () => {
            const result = findTagsInBuffer(base64ToArrayBuffer(fixtures.orientation.none));
            expect(result).to.deep.equal({});
        });
    });
});
