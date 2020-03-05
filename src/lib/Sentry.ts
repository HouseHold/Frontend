import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: 'https://ab50a0835f614928aeb17e74d0b03025@sentry.xn--gran-8qa.fi/6',
        integrations: [new Integrations.Vue({
            Vue,
            attachProps: true,
            logErrors: true
        })],
    });
}
