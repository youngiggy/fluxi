
function FluxiResolver(data) {
    this.resolvers = {};
}
FluxiResolver.prototype = {
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

