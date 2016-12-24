$(document).ready(function() {
    var gSuggestion = {
        options: {
            suggestWrapper: $('.js-suggestions-wrapper'),
            citySuggest: $('.city_suggest'),
            suggestBox: $('.suggest-box'),
            suggestions: []
        },
        getSuggestions: function(keyword) {
            var self = this;
console.log('get');
            $.ajax({
                method: "POST",
                url: self.options.suggestBox.data('suggest-url'),
                data: {
                    keyword: keyword,
                    language: self.options.suggestBox.data('suggest-language'),
                    country: self.options.suggestBox.data('suggest-country')
                }
            })
            .done(function (data) {
                self.options.suggestions = [];
                for(var i = 0; i < data.length; i++) {
                    self.options.suggestions.push(data[i].structured_formatting.main_text);
                }
                console.log(self.options.suggestions);
                self.options.citySuggest.autocomplete('option', 'source', ["Bernatoniai", "Berčiūnai", "Beržoras", "Bernatoniai", "Berteškiai"]);
                // self.options.citySuggest.autocomplete('option', 'source', self.options.suggestions);
            });
        },

        initSuggestion: function() {
            var self = this;
            self.options.citySuggest.autocomplete({
                source: function(request, response) {
                    $.ajax({
                        method: "POST",
                        url: self.options.suggestBox.data('suggest-url'),//whether you are using radios, checkboxes, or selects, you can change the endpoint at runtime automatically
                        dataType: "json",
                        data: {
                            keyword: request.term,
                            language: self.options.suggestBox.data('suggest-language'),
                            country: self.options.suggestBox.data('suggest-country')
                        },
                        success: function(data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.structured_formatting.main_text,
                                    value: item.structured_formatting.main_text
                                }
                            }));
                        }
                    });
                },
                minLength: 1,
                cacheLength: 0,
                select: function(event, ui) {}
            });
        },
        initSuggestionControls: function() {
            var self = this;
            self.options.citySuggest.on('keypress', function(e) {
                if ($(this).val().length >= 2) {
                    console.log('a');
                    if (e.which !== 0 && e.which !== 13) {
                        console.log('b');

                        self.getSuggestions($(this).val());
                    }
                }
            });
        },
        init: function() {
            this.initSuggestion();
            // this.initSuggestionControls();
        }
    };

    gSuggestion.init();
});