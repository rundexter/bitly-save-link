var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://api-ssl.bitly.com/'
});

var pickInputs = {
        'longUrl': 'longUrl',
        'title': 'title',
        'note': 'note',
        'private': { key: 'private', type: 'boolean' },
        'user_ts': 'user_ts',
        'domain': 'domain',
        'deeplinks': 'deeplinks'
    },
    pickOutputs = {
        'link': 'data.link_save.link',
        'aggregate_link': 'data.link_save.aggregate_link',
        'new_link': 'data.link_save.new_link',
        'long_url': 'data.link_save.long_url',
        'deeplinks': 'data.link_save.deeplinks'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            token = dexter.provider('bitly').credentials('access_token'),
            api = '/v3/user/link_save';

        if (validateErrors)
            return this.fail(validateErrors);

        inputs.access_token = token;
        request.get({uri: api, qs: inputs, json: true}, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.status_code !== 200 && body.status_code !== 304)
                this.fail(body);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
