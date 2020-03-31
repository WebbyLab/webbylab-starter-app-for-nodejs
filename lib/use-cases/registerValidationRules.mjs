/* istanbul ignore next */

import LIVR         from 'livr';
import extraRules   from 'livr-extra-rules';

const defaultRules = {
    ...extraRules,
    'future_date'() {
        return value => {
            if (value === undefined || value === null || value === '') return;
            const valueDate = new Date(value);

            valueDate.setTime(valueDate.getTime() + valueDate.getTimezoneOffset() * 60 * 1000);
            if (valueDate - new Date() < 0) return 'WRONG_DATE';

            return;
        };
    }
};

LIVR.Validator.registerDefaultRules(defaultRules);
