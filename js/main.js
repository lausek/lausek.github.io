document.addEventListener('DOMContentLoaded', function() {
    const DELAY = 1000;
    const GREETINGS = [
        'Hey, I am',
        'Hej, jag heter',
        'Moin, ich bin',
        'Terve, minä olen',
        'привет, я',
    ];

    let greeting = document.getElementById('greeting');
    let counter = 0;

    function next() {
        greeting.innerText = GREETINGS[counter];
        counter += 1;

        if(GREETINGS.length <= counter) {
            counter = 0;
        }

        setTimeout(next, DELAY)
    }

    next();
});
