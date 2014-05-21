var Events = require('events').EventEmitter
var inherits = require('inherits')

module.exports = Ifsm

inherits(Ifsm, Events)
function Ifsm(transitions, initialState) {
    Events.call(this)
    this.state = initialState || 'null'
    this.transitions = transitions || {}
}

Ifsm.prototype = {
    state: 'null'
  , transitions: {}
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
    return this
}

function releease() {
    this.removeAllListeners()
}

function calcTransition(transitions, from, to) {
    if (transitions[from + ' ' + to]) {
        return transitions[from + ' ' + to]
    }

    for (rule in transitions) {
        var split = rule.split(' ')

        if (checkRule(split[0], from) && checkRule(split[1], to)) {
            return transitions[rule]
        }
    }

    return function() {}
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