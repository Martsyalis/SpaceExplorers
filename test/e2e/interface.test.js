const assert = require('chai').assert;
const mockInput = require('mock-stdin').stdin();
const Interface = require('../../lib/routes/interface');

describe.only('Interface test',() => {

    const question = {
        type: 'input',
        name: 'name',
        message: 'Hi, What is your name?'
    };

    const questions = [
        {
            type: 'input',
            name: 'first name',
            message: 'Hi, What is your first name?'
        },
        {
            type: 'input',
            name: 'last name',
            message: 'Hi, What is your last name?'
        }
    ];
    
    it('should write a question to command line and receive a response', () => {
        const interface = new Interface();
        const promise = interface.askQuestions(question)
            .then((res) => {
                console.log('test INQ', res)
                assert.ok(res);
                assert.deepEqual(res.name, 'SHANE');
            });
        mockInput.send('SHANE\n');
        return promise;
    });

    it.only('should write multiple questions to command line and receive a response', () => {
        const interface = new Interface();
        const promise = interface.askQuestions(questions)
            .then((res) => {
                assert.ok(res);
                assert.deepEqual(res.name, 'SHANE');
                assert.deepEqual(res.name, 'SHANE');
            });
        mockInput.send(['SHANE\n','MOYO\n']);
        return promise;
    });
});