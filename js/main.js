
function FluxiStore(data) {
    this.data = data || {};
    this.listeners = {};
    this.valid = {};
    this.validators = {};
    this.resolvers = {};

    // this.opt = opt || {};
}
FluxiStore.prototype = {
    "dispatch" : function (group, key, val) {
        //change store
        val = val === undefined ? this.resolve(group, key) : val;
        this.save(group, key, val);

        this.emitChangeListener(group);

        //todo : post dispatch
        // - ex) validation check
    },
    "save" : function (group, key, val) {
        if (this.data[group] === undefined) {
            this.data[group] = {};
        }
        this.data[group][key] = val;
    },

    //add event listener
    "storeChangeListener" : function (group, func) {
        if (this.listeners[group] === undefined) {
            this.listeners[group] = [];
        }
        this.listeners[group].push(func);
    },
    "emitChangeListener" : function (group) {
        if (this.listeners[group] && this.listeners[group].length) {
            var len = this.listeners[group].length;
            for (var i = 0; i < len; i++) {
                this.listeners[group][i]();
            }
        }
    },

    //validator
    "addValidator" : function (group, validateFunc, defaultValid) {
        this.valid[group] = defaultValid === true;
        this.validators[group] = validateFunc;
    },
    "allValid" : function () {
        for (var i in this.validators) {
            if (this.validators.hasOwnProperty(i)) {
                if (this.validators[i] === false) {
                    return false;
                }
            }
        }
        return true;
    },

    //resolver : 특정 값을 얻어오기 위한 함수
    "addResolver" : function (group, key, func) {
        if (!this.resolvers[group]) {
            this.resolvers[group] = {};
        }
        if (typeof func === "function") {
            this.resolvers[group][key] = func;
        }
    },
    "resolve" : function (group, key) {
        if (this.resolvers[group] && this.resolvers[group][key]) {
            return this.resolvers[group][key]();
        }
        return null;
    }
};

