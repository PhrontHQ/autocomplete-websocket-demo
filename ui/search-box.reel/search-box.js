/**
 * @module ui/search-box.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SearchBox
 * @extends Component
 */
exports.SearchBox = Component.specialize(/** @lends SearchBox# */ {

    term: {
        value: null
    },

    tags: {
        value: null
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.textFieldElement.addEventListener("input", this, false);
                this.tags = [];
            }
        }
    },

    selectedTag: {
        set: function (value) {
            if (value) {
                this.tags.splice(this.tags.indexOf(value), 1);
                this.tags = this.tags.slice(0);
            }
        }
    },

    handleInput: {
        value: function () {
            this.autocompleteLeft.value = this.textFieldElement.value;
            this.autocompleteRight.value = "";
            this.term = null;
            this.tags = [];
            if (this.textFieldElement.value) {
                this.application.services.autocompleteTerm(
                    this.textFieldElement.value,
                    this.handleAutocomplete.bind(this)
                );
            }
        }
    },

    handleAutocomplete: {
        value: function (term) {
            if (term) {
                this.autocompleteRight.value = term.substr(this.textFieldElement.value.length);
                this.term = term;
            }
        }
    }

});
