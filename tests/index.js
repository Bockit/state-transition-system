var StateTransitionSystem = require('../index')
var test = require('tape')

test('Instantiation', function(t) {
    t.plan(3)
    var stateMachine = new StateTransitionSystem()

    t.equal(stateMachine.state, 'null', 'Default initial state')
    t.equal(stateMachine.transitions.length, 0, 'No initial transitions')

    stateMachine = new StateTransitionSystem('a')
    t.equal(stateMachine.state, 'a', 'Passed in initial state')

    t.end()
})

test('Simple transitions', function(t) {
    t.plan(3)
    var stateMachine = new StateTransitionSystem()
    stateMachine
        .addTransition('null', 'a', function() {
            t.pass('Initial transition')
        })
        .addTransition('a', 'b', function() {
            t.pass('Secondary transition')
        })

    stateMachine.changeState('a')
    t.equal(stateMachine.state, 'a', 'State changed')
    stateMachine.changeState('b')

    t.end()
})

test('Callback arguments', function(t) {
    t.plan(4)
    var stateMachine = new StateTransitionSystem

    var param = [ 'hello' ]

    stateMachine.addTransition('*', '*', function(oldState, newState, param1) {
        t.equal(oldState, 'null', 'Old state is passed to callback')
        t.equal(newState, 'a', 'New state is passed to callback')
        t.equal(arguments.length, 3, 'Parameters are being passed')
        t.equal(param1, param, 'Parameters are kept referentially the same')
    })

    stateMachine.changeState('a', param)
    t.end()

})

test('Multiple callbacks', function(t) {
    t.plan(3)
    var stateMachine = new StateTransitionSystem()
    stateMachine
        .addTransition('null', 'a', function() {
            t.pass('1/2 multiple callbacks in one addTransition call')
        }, function() {
            t.pass('2/2 multiple callbacks in one addTransition call')
        })
        .addTransition('null', 'a', function() {
            t.pass('Callback from second addTransition call')
        })
        .changeState('a')

    t.end()
})

test('Wildcards', function(t) {
    t.plan(2)
    var stateMachine = new StateTransitionSystem()
    stateMachine
        .addTransition('null', '*', function() {
            t.pass('Wildcard callback')
        })
        .addTransition('null', '*!a', function() {
            t.fail('Callback should not fire because of wildcard negation')
        })
        .addTransition('null', '*!b', function() {
            t.pass('Wildcard negation should not block')
        })

    stateMachine.changeState('a')
    t.end()
})