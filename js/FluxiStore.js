
function FluxiStore(data) {
    this.data = data || {};
    this.repainters = {};
    this.listeners = {};
    this.valid = {};
    this.validators = {};
    // this.resolvers = {};

    // this.opt = opt || {};
}
FluxiStore.prototype = {
    dispatch : function (group, key, val) {
        //change store
        // val = val === undefined ? this.resolve(group, key) : val;
        this.save(group, key, val);

        this.emitChangeListener(group);

        //post dispatch
        //validation check
        this.log('validation checked : ' + this.allValid());
    },
    setInitialDataIfEmpty : function (group, initialData) {
        if (this.data[group] === undefined) {
            initialData = initialData || {};
            this.data[group] = initialData;
        }
    },
    save : function (group, key, val) {
        if (this.data[group] === undefined) {
            this.data[group] = {};
        }
        this.data[group][key] = val;
    },

    //define repainter
    defineRepainter : function (group, func) {
        if (this.repainters[group] !== undefined) {
            this.log('WARNING : Redefined ' + group + ' repainter');
        }
        this.repainters[group] = func;
    },

    //add repainter to event listener
    addChangeListener : function (repaintGroup, storeGroupsToWatch, func) {
        var len = storeGroupsToWatch.length,
            targetGroup;
        func = func || this.repainters[repaintGroup];

        for (var i = 0; i < len; i++) {
            targetGroup = storeGroupsToWatch[i];
            if (this.listeners[targetGroup] === undefined) {
                this.listeners[targetGroup] = [];
            }
            this.listeners[targetGroup].push(func);
        }
    },
    emitChangeListener : function (group) {
        if (this.listeners[group] && this.listeners[group].length) {
            var len = this.listeners[group].length;
            for (var i = 0; i < len; i++) {
                this.listeners[group][i]();
            }
        }
    },

    //validator
    addValidator : function (group, validateFunc, defaultValid) {
        this.valid[group] = defaultValid === true;
        this.validators[group] = validateFunc;
    },
    allValid : function () {
        for (var i in this.validators) {
            if (this.validators.hasOwnProperty(i)) {
                if (this.validators[i] === false) {
                    return false;
                }
            }
        }
        return true;
    },
    //
    // // resolver : Ư�� ���� ������ ���� �Լ�
    // "addResolver" : function (resolveKey, func) {
    //     if (typeof func === 'function') {
    //         this.resolvers[resolveKey] = func;
    //     }
    // },
    // "resolve" : function (resolveKey) {
    //     if (this.resolvers[resolveKey]) {
    //         return this.resolvers[resolveKey]();
    //     }
    //     return null;
    // }
    /**
     * job_category �����͸� ��ȸ�ϱ�
     * @param callbackFunc
     * @param excludes
     * @returns {Array}
     */
    inspectJobCategory : function (callbackFunc, excludes) {
        excludes = excludes || [];

        var data = this.data.job_category ? this.data.job_category.job_category : {},
            contentArr = [],
            keywordRows;

        for (var code in data) {
            if (data.hasOwnProperty(code)) {
                var objByCode = data[code],
                    codeName = objByCode.name,
                    keywordsByCode = objByCode.keyword;
                for (var keyword in keywordsByCode) {
                    if (keywordsByCode.hasOwnProperty(keyword)) {
                        if (jQuery.inArray(keyword, excludes) === -1) {
                            keywordRows = {
                                'keyword': keyword,
                                'keywordName': keywordsByCode[keyword],
                                'codeName': codeName,
                                'code': code
                            };
                            contentArr.push(
                                callbackFunc ? callbackFunc(keywordRows) : keywordRows
                            );
                        }
                    }
                }
            }
        }
        return contentArr;
    },
    updateJobCategoryExcludeWith : function (excludes) {
        var keywordRows = this.inspectJobCategory(null, excludes),
            len = keywordRows.length,
            newJobCategory = {},
            keyword, keywordName, codeName, code;

        for (var i = 0; i < len; i++) {
            keyword = keywordRows[i].keyword;
            keywordName = keywordRows[i].keywordName;
            codeName = keywordRows[i].codeName;
            code = keywordRows[i].code;

            if (!newJobCategory[code]) {
                newJobCategory[code] = {
                    'name' : codeName,
                    'keyword' : {}
                };
            }
            newJobCategory[code].keyword[keyword] = keywordName;
        }

        this.dispatch('job_category', 'job_category', newJobCategory);
    },
    log : function (msg) {
        if (window.console) {
            console.log(msg);
        }
    }
};

