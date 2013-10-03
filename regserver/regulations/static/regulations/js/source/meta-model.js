define('meta-model', ['underscore', 'backbone', 'dispatch'], function(_, Backbone, Dispatch) {
    'use strict';
    var MetaModel = Backbone.Model.extend({

        constructor: function(properties) {
            var k;

            if (typeof properties !== 'undefined') {
                for (k in properties) {
                    if (properties.hasOwnProperty(k)) {
                        this[k] = properties[k];
                    }
                }
            }

            // in the case of reg-model
            // an index of all of the entities in the reg, whether or not they've been loaded
            this.content = this.content || {};

            // in the case of reg-model
            // content = markup to string representations of each reg paragraph/entity
            // loaded into the browser (rendered or not)
            this.structure = this.structure || [];

            Backbone.Model.apply(this, arguments);
        },

        set: function(sectionId, sectionValue) {
            var cached = this.has(sectionId),
                section;

            if (typeof sectionId !== 'undefined' && !(_.isEmpty(sectionId))) {
                if (!(cached)) {
                    this.content[sectionId] = sectionValue;
                    section = sectionValue;

                    if (_.indexOf(this.structure, sectionId) === -1) {
                        this.structure.push(sectionId);
                    }
                }
                else {
                    section = cached;
                }
            }
            return section; 
        },

        // **Param**
        // id, string, dash-delimited reg entity id
        //
        // **Returns** boolean
        has: function(id) {
            return (this.content[id]) ? true : false;
        },
 
        // **Params**
        // 
        // * ```id```: string, dash-delimited reg entity id
        // * ```callback```: function to be called once content is loaded
        get: function(id, callback) {
            var $promise, resolve;

            Dispatch.trigger('content:loading');

            // if we have the requested content cached, retrieve it
            // otherwise, we need to ask the server for it
            $promise = (this.has(id)) ? this._retrieve(id) : this.request(id);

            // callback once the promise resolves
            resolve = function(response) {
                if (typeof callback !== 'undefined') {
                callback(response);
                }
                Dispatch.trigger('content:loaded');
            };

            $promise.done(resolve);

            $promise.fail(function() {
                var alertNode = document.createElement('div');

                alertNode.innerHTML = 'There was an issue loading your data. This may be because your device is currently offline. Please try again.';
                alertNode.className = 'alert';

                $(alertNode).insertBefore('h2.section-number');
                Dispatch.trigger('content:loaded');

                callback.apply(false);
            });

            return this;
        },

        _retrieve: function(id) {
            var $deferred = $.Deferred();

            $deferred.resolve(this.content[id]);

            return $deferred.promise();
        },

        request: function(id) {
            var url = this.getAJAXUrl(id),
                $promise;

            $promise = $.ajax({
                url: url,
                success: function(data) { this.set(id, data); }.bind(this)
            });

            return $promise;
        },

        getAJAXUrl: function(id) {
            var url,
                urlPrefix = Dispatch.getURLPrefix();

            if (urlPrefix) {
                url = '/' + urlPrefix + '/partial/';
            }
            else {
                url = '/partial/';
            }

            if (typeof this.supplementalPath !== 'undefined') {
                url += this.supplementalPath + '/';
            }

            url += id;

            if (id.indexOf('/') === -1) {
                url += '/' + Dispatch.getVersion(); 
            }

            return url;
        },

        // We don't have need for the following methods.
        // This is my half-baked way of overriding them so that they
        // can be legally called as Backbone runs its course, but have
        // no effect.
        sync: function() {
            return;
        },

        save: function() {
            return;
        },

        destroy: function() {
            return;
        }
    });

    return MetaModel;
});
