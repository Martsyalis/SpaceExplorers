const assert = require('chai').assert;
const Character = require('../../lib/models/character');

describe( 'Character model', () => {
    
    it('check if good model', () => {
        const character = new Character({
            name: 'Ellen Ripley',
            description: 'Warrant officer who survived multiple encounters with Xenomorphs',
            ship:{
                name: 'Moya',
                healthPoints: 1000,
                damage: 100,
                description: 'A living sentient bio-mechanical space ship.',
                class: 'Leviathan'
            },
            user: '590643bc2cd3da2808b0e651',
            log: ['590643bc2cd3da2808b0e651']
        });
        assert.equal(character.validateSync(), undefined);
    });

    it('checks required fields', () => {
        const character = new Character({ 
            ship:{
                description: 'A living sentient bio-mechanical space ship.',
                class: 'Leviathan'
            }
        });
        const { errors } = character.validateSync();
        assert.equal(errors.name.kind, 'required');
    });
    
    it('checks for nested required fields', () => {
        const character = new Character({ 
            ship:{
                description: 'A living sentient bio-mechanical space ship.',
                class: 'Leviathan'
            },
            log: ['badid']
        });
        const { errors } = character.validateSync();
        assert.equal(errors['ship.name'].kind, 'required');
        assert.equal(errors['ship.healthPoints'].kind, 'required');
        assert.equal(errors['ship.damage'].kind, 'required');
        assert.equal(errors.log.kind, 'Array');
        assert.equal(errors.log.reason.kind, 'ObjectId');
    });

});