/* --- options for jshint --- */
/*global alert:false*/
/*global console:false*/
/*global confirm:false*/
/*jshint -W100*/
function LayerHandler(opt) {
    if (window.jQuery === undefined) {
        this.log('Check jQuery Loaded!');
    }

    this.truncateRules = {};

    //�⺻ option
    this.opt = opt || {};
    this.rootLayerSelector = this.opt.rootLayerSelector || 'body';
}
LayerHandler.prototype = {
    "bindRootClickEvent": function () {
        var self = this;
        jQuery(this.rootLayerSelector).on('click', function () {
            self.truncate();
        });
    },
    "truncate" : function () {
        var truncateRule;

        for (var i in this.truncateRules) {
            if (!this.truncateRules.hasOwnProperty(i)) {
                continue;
            }

            truncateRule = this.truncateRules[i];
            truncateRule.function();
        }
        this.truncateRules = {};
    },
    "addTruncateFuntion": function (truncateRuleObj) {
        if (!this.truncateRules[truncateRuleObj.id]) {
            this.truncateRules[truncateRuleObj.id] = truncateRuleObj;
        }
    }
};
