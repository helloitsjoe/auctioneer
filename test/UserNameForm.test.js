import * as React from 'react';
import { mount } from 'enzyme';
import { UserNameForm } from '../src/user/UserNameForm';

describe('UserNameForm', function() {
    let userNameForm;
    let input;

    beforeEach(() => {
        userNameForm = mount(<UserNameForm user="Joe" />);
        input = userNameForm.find('input');
    });

    afterEach(() => {
        userNameForm.unmount();
    });

    it('displays uppercase username', function() {
        expect(input.html()).toMatch(/JOE/);
    });

    it('update username on change', function() {
        input.prop('onChange')({ target: { value: 'Missy' } });
        expect(input.html()).toMatch(/MISSY/);
        expect(input.html()).not.toMatch(/JOE/);
    });

    it('blur input on submit', function() {
        const select = jest.fn();
        const preventDefault = jest.fn();
        expect(document.activeElement.tagName).toBe('BODY');
        input.prop('onFocus')({ target: { select } });
        expect(document.activeElement.tagName).toBe('INPUT');
        userNameForm.find('form').prop('onSubmit')({ preventDefault });
        expect(preventDefault).toBeCalledTimes(1);
        expect(document.activeElement.tagName).toBe('BODY');
    });

    it('select all text on focus', function() {
        const select = jest.fn();
        input.prop('onFocus')({ target: { select } });
        expect(select).toBeCalledTimes(1);
    });
});
