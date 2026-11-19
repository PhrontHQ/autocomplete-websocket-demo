/**
 * @module ui/reader.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Reader
 * @extends Component
 */
exports.Reader = Component.specialize(/** @lends Reader# */ {

    _isVisible: {
        value: false
    },

    isVisible: {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = value;
            if (value) {
                this.classList.add("Reader-isVisible");
            } else {
                this.classList.remove("Reader-isVisible");
            }
        }
    },

    handleCloseAction: {
        value: function () {
            this.isVisible = false;
            this.article = null;
            this.articleElement.scrollTop = 0;
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
            var images;

            this._article = value;
            if (value) {
                this.titleElement.textContent = value.title;
                this.contentElement.innerHTML = value.content;
                if (images = value.images) {
                    if (images.length) {
                        var image = document.createElement("div");

                        image.style.backgroundImage = "url(server/images/" + images[0] + ")";
                        image.className = "Reader-image";
                        this.contentElement.insertBefore(image, this.contentElement.children[1]);
                    }
                }
            }
        }
    }

});
