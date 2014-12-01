var StateTransitionSystem = require('../index')
var test = require('tape')

test('Instantiation', function(t) {
    t.plan(2)
    var stateMachine = new StateTransitionSystem()

    t.equal(stateMachine.state, 'null', 'Default initial state')
    t.equal(stateMachine.transitions.length, 0, 'No initial transitions')

    t.end()
})

test('Simple transitions', function(t) {
    t.plan(3)
    var stateMachine = new StateTransitionSystem()
    stateMachine.addTransition('null', 'a', function() {
        t.pass('Initial transition')
    })
    stateMachine.addTransition('a', 'b', function() {
        t.pass('Secondary transition')
    })

    stateMachine.become('a')
    t.equal(stateMachine.state, 'a', 'State changed')
    stateMachine.become('b')

    t.end()
})