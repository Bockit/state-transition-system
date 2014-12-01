module.exports = StateMachine

var Events = require('events').EventEmitter
var extend = require('extend')

function StateMachine(initialState) {
    Events.call(this)
    this.state = initialState || 'null'
    this.transitions = []
}

StateMachine.prototype = extend({}, Events.prototype, {
    state: 'null'
  , addTransition: addTransition
  , become: become
  , release: release
})

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

function addTransition(from, to) {
    for (var i = 2; i < arguments.length; i++) {
        this.transitions.push({
            from: from
          , to: to
          , fn: arguments[i]
        })
    }
    return this
}

function calcTransitions(transitions, from, to) {
    var fns = []
    for(var i = 0; i < transitions.length; i++) {
        if (checkRule(transitions[i].from, from) &&
            checkRule(transitions[i].to, to)) {

            fns.push(transitions[i].fn)
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
        if (Array.isArray(arguments[i])) {
            for (var j = 0; j < arguments[i].length; j++) {
                args.push(arguments[i][j])
            }
        }
        else {
            args.push(arguments[i])
        }
    }
    return args
}