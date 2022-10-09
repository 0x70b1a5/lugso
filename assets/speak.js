// adapted from http://ipareader.xyz

var API_ENDPOINT = "https://iawll6of90.execute-api.us-east-1.amazonaws.com/production";
var VOICES = {
    Ivy: "Ivy [English - American]",
    Joanna: "Joanna [English - American]",
    Joey: "Joey [English - American]",
    Justin: "Justin [English - American]",
    Kendra: "Kendra [English - American]",
    Kimberly: "Kimberly [English - American]",
    Salli: "Salli [English - American]",
    Nicole: "Nicole [English - Australian]",
    Russell: "Russell [English - Australian]",
    Emma: "Emma [English - British]",
    Brian: "Brian [English - British]",
    Amy: "Amy [English - British]",
    Raveena: "Raveena [English - Indian]",
    Geraint: "Geraint [English - Welsh]",
    Ricardo: "Ricardo [Brazilian Portuguese]",
    Vitoria: "Vitoria [Brazilian Portuguese]",
    Lotte: "Lotte [Dutch]",
    Ruben: "Ruben [Dutch]",
    Mathieu: "Mathieu [French]",
    Celine: "Celine [French]",
    Chantal: "Chantal [Canadian French]",
    Marlene: "Marlene [German]",
    Dora: "Dora [Icelandic]",
    Karl: "Karl [Icelandic]",
    Carla: "Carla [Italian]",
    Giorgio: "Giorgio [Italian]",
    Mizuki: "Mizuki [Japanese]",
    Liv: "Liv [Norwegian]",
    Maja: "Maja [Polish]",
    Jan: "Jan [Polish]",
    Ewa: "Ewa [Polish]",
    Cristiano: "Cristiano [Portuquese]",
    Ines: "Ines [Portuquese]",
    Carmen: "Carmen [Romanian]",
    Maxim: "Maxim [Russian]",
    Tatyana: "Tatyana [Russian]",
    Enrique: "Enrique [Spanish]",
    Penelope: "Penelope [US Spanish]",
    Enrique: "Miguel [US Spanish]",
    Conchita: "Conchita [Castilian Spanish]",
    Astrid: "Astrid [Swedish]",
    Filiz: "Filiz [Turkish]",
    Gwyneth: "Gwyneth [Welsh]",
};
var DEFAULT_VOICE = 'Miguel';

$(document).ready(function() {
    $('.speak').on('click', function(e) {
        e.preventDefault();
        $(e.target).text('🎵')

        var text = $(e.target).attr('data-ipa');
        var voice = DEFAULT_VOICE;
        sendToPolly(text, voice);
    });
});

function sendToPolly(text, voice) {

    // clear any previous audio players or errors
    $('audio').remove();
    $('.error').hide();

    // get selected values
    var data = {
        text: text,
        voice: (voice || DEFAULT_VOICE),
    };

    if (data.text == '') {
        alert('Error: no IPA to speak.')
        return;
    }

    $('.ipa').prop('disabled', 'disabled');

    // submit request
    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: readResponse,
        error: errorResponse,
    });
}

function readResponse(response) {
    var source = '<source src="data:audio/mpeg;base64,' + response + '" type="audio/mpeg"></source>';
    var audio = '<audio autoplay="true" controls>' + source + '</audio>';
    $('.audio').prepend(audio);

    reset();
}

function errorResponse(response) {
    console.log(response);
    alert('There was an error processing your request.');
    reset();
}

function reset() {
    $('.speak').prop('disabled', false).text('🔈');
}