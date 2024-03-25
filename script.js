let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (event) {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            document.getElementById('recordingsList').appendChild(audio);

            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.mp3');

            fetch('/transcribe', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.text);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
    });

document.getElementById('start-recording').addEventListener('click', function () {
    audioChunks = [];
    mediaRecorder.start();
});

document.getElementById('stop-recording').addEventListener('click', function () {
    mediaRecorder.stop();
});
