$(document).ready(function() {
    var gSuggestion = {
        options: {
            suggestWrapper: $('.js-suggestions-wrapper'),
            citySuggest: $('.city_suggest'),
            citySuggestWrapper: $('.city-suggest-wrapper'),
            waiting: false,
            timeToWait: 300,
            refreshSuggestions: false
        },
        addSuggestItem: function(text) {
            var self = this;
            var elem = $('<li><a>' + text +'</a></li>');
            elem.on('click', function(e) {
                self.options.citySuggest.val(text);
                self.hideSuggestions();
                e.stopPropagation();
            });
            this.options.suggestWrapper.append(elem);
        },
        getSuggestions: function(keyword) {
            var self = this;

            $.ajax({
                method: "POST",
                url: self.options.suggestWrapper.data('suggest-url'),
                data: {
                    keyword: keyword,
                    language: self.options.suggestWrapper.data('suggest-language'),
                    country: self.options.suggestWrapper.data('suggest-country')
                }
            })
            .done(function (data) {
                for(var i = 0; i < data.length; i++) {
                    self.addSuggestItem(data[i].structured_formatting.main_text);
                }
                if (data.length > 0) {
                    self.options.suggestWrapper.show();
                }
            });
        },
        waiter: function(callback) {
            if ($.now() >= this.options.waiting) {
                callback();
            } else {
                setTimeout(this.waiter, this.options.timeToWait);
            }
        },

        suggest: function() {
            var self = this;
            self.options.waiting = $.now();
            self.options.refreshSuggestions = true;
            setTimeout(function () {
                self.waiter(function () {
                    if (self.options.refreshSuggestions) {
                        self.getSuggestions($('.city_suggest').val());
                        self.options.refreshSuggestions = false;
                    }
                });
            }, self.options.timeToWait);
        },

        initSuggestion: function() {
            var self = this;

            self.options.citySuggest.on('keypress', function(e) {
                if ($(this).val().length >= 2) {
                    if (e.which !== 0 && e.which !== 13) {
                        self.suggest();
                    }
                }
            });

            self.options.citySuggest.on('focus', function(e) {
                if ($(this).val().length >= 2) {
                    self.suggest();
                }
                e.stopPropagation();
            });
        },
        initSuggestionControls: function() {
            var self = this;
            self.options.citySuggest.on('keyup', function(e) {
                if ($(this).val().length < 3) {
                    self.hideSuggestions();
                }
                var activeElement = self.options.suggestWrapper.find('li.active');
                switch(e.which) {
                    case 38: // up
                        if (activeElement.length == 0) {
                            var el = self.options.suggestWrapper.find('li:last');
                            el.addClass('active');
                        } else {
                            var prevActive = activeElement.prev();
                            activeElement.removeClass('active');
                            prevActive.addClass('active');
                            if (prevActive == 0) {
                                var el = self.options.suggestWrapper.find('li:last');
                                el.addClass('active');
                            }
                        }
                        break;
                    case 40: // down
                        if (activeElement.length == 0) {
                            var el = self.options.suggestWrapper.find('li:first');
                            el.addClass('active');
                        } else {
                            var newActive = activeElement.next();
                            if (newActive.length == 0) {
                                var el = self.options.suggestWrapper.find('li:first');
                                el.addClass('active');
                            }
                            activeElement.removeClass('active');
                            newActive.addClass('active');
                        }
                        break;
                    case 13: //enter
                        var value = activeElement.find('a').html();
                        self.options.citySuggest.val(value);
                        self.hideSuggestions();
                        e.stopPropagation();
                        break;
                    case 8: //backspace
                        if ($(this).val().length >= 2) {
                            self.suggest();
                        }
                        break;
                    default: return; // exit this handler for other keys
                }
            });
        },
        hideSuggestions: function() {
            var self = this;
            self.options.suggestWrapper.empty();
            self.options.suggestWrapper.hide();
        },
        initBodyEvents: function() {
            var self = this;
            $(document).on('mouseup', function(e){
                var container = self.options.citySuggestWrapper;

                if (!container.is(e.target)
                    && container.has(e.target).length === 0)
                {
                    self.hideSuggestions();
                    e.stopPropagation();
                }

            });
        },
        init: function() {
            this.initSuggestion();
            this.initSuggestionControls();
            this.initBodyEvents();
        }
    };

    gSuggestion.init();
});