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
                data: [questionsParsed[0].blue, questionsParsed[0].green, questionsParsed[0].red, questionsParsed[0].purple],
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
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var q2ctx = document.getElementById('q2Chart').getContext('2d');
    var q2Chart = new Chart(q2ctx, {
        type: 'pie',
        data: {
            labels: ['Italian', 'Asian', 'Mexican', 'Moroccan'],
            datasets: [{
                label: '# of Votes',
                data: [questionsParsed[1].italian, questionsParsed[1].asian, questionsParsed[1].mexican, questionsParsed[1].moroccan],
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
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var q3ctx = document.getElementById('q3Chart').getContext('2d');
    var q3Chart = new Chart(q3ctx, {
        type: 'pie',
        data: {
            labels: ['Dog', 'Cat', 'Sloth', 'Eagle'],
            datasets: [{
                label: '# of Votes',
                data: [questionsParsed[2].dog, questionsParsed[2].cat, questionsParsed[2].sloth, questionsParsed[2].eagle],
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
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};