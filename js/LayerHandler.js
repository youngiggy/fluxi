
function LayerHandler(opt) {
    if (window.jQuery === undefined) {
        this.log('Check jQuery Loaded!');
    }

    this.truncateRules = {};

    //±âº» option
    this.opt = opt || {};
    this.rootLayerSelector = this.opt.rootLayerSelector || 'body';
}
LayerHandler.prototype = {
    bindRootClickEvent : function () {
        var self = this;
        jQuery(this.rootLayerSelector).on('click', function () {
            self.truncate();
        });
    },
    truncate : function (excludes) {
        for (var i in this.truncateRules) {
            if (!this.truncateRules.hasOwnProperty(i)) {
                continue;
            }
            if (excludes && jQuery.inArray(i, excludes) !== -1) {
                continue;
            }

            if (this.truncateRules[i] && this.truncateRules[i].execute) {
                this.truncateRules[i].execute();
                delete this.truncateRules[i];
            }
        }
    },
    addTruncateFuntion : function (truncateRuleObj) {
        if (!this.truncateRules[truncateRuleObj.id]) {
            this.truncateRules[truncateRuleObj.id] = truncateRuleObj;
        }
    }
};
