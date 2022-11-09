const Person = require('../../shouty')
const { Given, When, Then } = require("@cucumber/cucumber");

Given('Lucy is located \\{{int}} metres from Sean', function (int) {
    this.todo = Person();
    console.log('int', this);
    return 'pending';
});

When('Sean shouts {string}', function (string) {
    
    return 'pending';
});

Then('Lucy hears Sean\'s message', function () {
    return 'pending';
});
