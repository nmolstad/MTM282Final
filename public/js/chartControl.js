window.onload = async function() {
    const questions = await this.fetch("/data");
    const questionsParsed = await questions.json();

    var q1ctx = document.getElementById('q1Chart').getContext('2d');
    var q1Chart = new Chart(q1ctx, {
        type: 'pie',
        data: {
            labels: ['Blue', 'Green', 'Red', 'Purple'],
            datasets: [{
                label: '# of Votes',
                data: [questionsParsed[0].answer1, questionsParsed[0].answer2, questionsParsed[0].answer3, questionsParsed[0].answer4],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(196, 0, 218, 0.2)',
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(196, 0, 218, 1)',
                ],
                borderWidth: 1
            }]
        },
    });

    var q2ctx = document.getElementById('q2Chart').getContext('2d');
    var q2Chart = new Chart(q2ctx, {
        type: 'pie',
        data: {
            labels: ['Italian', 'Asian', 'Mexican', 'Moroccan'],
            datasets: [{
                label: '# of Votes',
                data: [questionsParsed[1].answer1, questionsParsed[1].answer2, questionsParsed[1].answer3, questionsParsed[1].answer4],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(196, 0, 218, 0.2)',
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(196, 0, 218, 1)',
                ],
                borderWidth: 1
            }]
        },
    });

    var q3ctx = document.getElementById('q3Chart').getContext('2d');
    var q3Chart = new Chart(q3ctx, {
        type: 'pie',
        data: {
            labels: ['Dog', 'Cat', 'Sloth', 'Eagle'],
            datasets: [{
                label: '# of Votes',
                data: [questionsParsed[2].answer1, questionsParsed[2].answer2, questionsParsed[2].answer3, questionsParsed[2].answer4],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(196, 0, 218, 0.2)',
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(196, 0, 218, 1)',
                ],
                borderWidth: 1
            }]
        },
    });
};