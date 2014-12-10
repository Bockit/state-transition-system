State Transition System
=======================

![Build status](https://api.travis-ci.org/Bockit/state-transition-system.svg?branch=master)

Use this module to create [infinite-state-machines](http://en.wikipedia.org/wiki/State_transition_system). A State Machine defines transition rules, which comprise a from state, a to state, and n array of functions to call when the machine transitions between those states. For example, you could have a rule, from `'loading'` to `'idle'` you call `render()`.


Usage
-----

Require the module and then instantiate however many state machines you need. The first and only argument is an initialState (defaults to `'null'`).

```javascript
var StateMachine = require('state-transition-system')
var sm = new StateMachine('woo')
```

You then add transitions with the `addTransition` function.

```javascript
sm.addTransition('woo', 'wee', function(){...})
```

Finally, change the state of the machine with `sm.changeState()`

```javascript
sm.changeState('wee') // ... executes.
```

You can add multiple transitions in 1 call

```javascript
sm.addTransition('woo', 'waa', function(){...}, function(){...})
```

You can add multiple transitions in multiple calls

```javascript
sm.addTransition('woo', 'waa', function(){...})
sm.addTransition('woo', 'waa', function(){...})
sm.addTransition('woo', 'waa', function(){...})
```

It will find all functions that match a state change and execute them first-in first-out.


State Rules
-----------

There is some wildcard logic in state rules. `'*'` will match any state, and `'*!waa'` will match any state except `'waa'`. You can chain more exclusions as you wish, for example `'*!waa!wuu'`.

By adding wildcards, it means multiple transitions could be valid for a single state change. In these cases, it will execute all transitions in the order that they were added to the state machine with `addTransition()`


Example
-------

```javascript
var StateMachine = require('state-transition-system')
var sm = new StateMachine('woo')

sm.addTransition('woo', 'wee', function() { console.log('nice') })
sm.addTransition('wee', 'waa', function() { console.log('one!') })
sm.addTransition('woo', '*!wee', function() { console.log('excluded') })

sm.changeState('wee') // 'nice!'
sm.changeState('waa') // 'one!'
sm.changeState('woo') // nothing, because no transition matches
sm.changeState('waa') // 'excluded'
```

Events
------

State Machine instances are node EventEmitters. As such they provide the EventEmitter API as well. Two events are emitted as the states change. Firstly, `'changestate'`, and `'changestate:<name>'`'.

#### `changestate` ####

Event that fires when state is changed. First argument to any callbacks is the state, subsequent arguments are those passed into the `changeState` call.


#### `changestate:<name>` ####

Event that fires when a state is changed. Includes the name of the state in the event name. Arguments match those passed into the `changeState()` call.

API
---

#### `new StateMachine(initialState)` ####

Construct a state machine with an initial state of `initialState`.


#### `sm.addTransition(from, to, fn)` ####

Adds a transition to a state machine. When the state machine transitions from `from` to `to` then `fn` will be called. The first two arguments to `fn` will be `from` and `to`, subsequent arguments will match those passed in when `changeState` is called.


#### `sm.changeState(state)` ####

Changes the state machines state to `state`. Any transitions that have been registered that match the transition will be called.
