/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    Services = require("../../core/services").Services;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    constructor: {
        value: function () {
            this.application.services = Services;
        }
    },

    _searchTerm: {
        value: null
    },

    searchTerm: {
        get: function () {
            return this._searchTerm;
        },
        set: function (value) {
            this._searchTerm = value;
            this.application.services.getTagsForQuery(value, [], this.handleGetTagsForQuery.bind(this));
            this.application.services.searchArticles(value, [], this.handleSearchArticles.bind(this));
        }
    },

    _searchTags: {
        value: null
    },

    searchTags: {
        get: function () {
            return this._searchTags;
        },
        set: function (value) {
            this._searchTags = value;
            this.application.services.getTagsForQuery(this._searchTerm, value, this.handleGetTagsForQuery.bind(this));
            this.application.services.searchArticles(this._searchTerm, value, this.handleSearchArticles.bind(this));
        }
    },

    handleGetTagsForQuery: {
        value: function (tags) {
            this.tags = tags;
        }
    },

    handleSearchArticles: {
        value: function (articles) {
            this.articles = articles;
        }
    },

    _selectedArticle: {
        value: null
    },

    selectedArticle: {
        get: function () {
            return this._selectedArticle;
        },
        set: function (value) {
            this._selectedArticle = value;
            if (value) {
                this.application.services.getArticle(value.id, this.handleGetArticle.bind(this));
            }
        }
    },

    _article: {
        value: null
    },

    article: {
        get: function () {
            return this._article;
        },
        set: function (value) {
            this._article = value;
            this.selectedArticle = null;
        }
    },

    handleGetArticle: {
        value: function (article) {
            this.reader.isVisible = true;
            this.reader.article = article;
        }
    }

});
