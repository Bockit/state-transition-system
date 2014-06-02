var Events = require('events').EventEmitter
var inherits = require('inherits')

module.exports = StateMachine

inherits(StateMachine, Events)
function StateMachine(initialState) {
    Events.call(this)
    this.state = initialState || 'null'
}

StateMachine.prototype = {
    state: 'null'
  , transitions: []
  , addTransition: addTransition
  , become: become
  , release: release
}

function become(state) {
    var transitions = calcTransitions(this.transitions, this.state, state)
    var args = makeArgs(this.state, state, [].slice.call(arguments))
    for (var i = 0; i < transitions.length; i++) {
        transitions[i].apply(null, args)
    }
    this.state = state
    this.emit.apply(this, makeArgs('changestate', args))
    this.emit.apply(this, makeArgs('changestate:' + state,
        [].slice.call(arguments)))
    return this
}

function release() {
    this.removeAllListeners()
}

function addTransition(from, to, fns) {
    this.transitions.push({
        from: from
      , to: to
      , fns: fns
    })
}

function calcTransition(transitions, from, to) {
    var fns = []
    for(var i = 0; i < transitions.length; i++) {
        if (checkRule(transitions[i].from, from) &&
            checkRule(transitions[i].to, to)) {

            fns.concat(transitions[i].fns)
        }
    }
    return fns
}

function checkRule(rule, state) {
    if (state === null) {
        state = 'null'
    }

    // 'loading' === 'loading'
    if (state === rule) {
        return true
    }

    // Straight wildcard
    if (rule === '*') {
        return true
    }

    // Starts with wildcard
    if (rule[0] === '*') {
        var excludes = rule.split('!').slice(1)
        return !!(excludes.indexOf(state) + 1)
    }

    // No match
    return false
}

function makeArgs() {
    var args = []
    for (var i = 0; i < arguments.length; i++) {
        if (Array.isArray(arguments[i]) {
            for (var j = 0; j < arguments[i].length; i++) {
                args.push(arguments[i][j])
            }
        }
        else {
            args.push(arguments[i])
        }
    }
    return args
}