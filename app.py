from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)
client = OpenAI()

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    audio_file = request.files['audio']
    transcription = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
    return jsonify({'text': transcription.text})

if __name__ == '__main__':
    app.run(debug=True)
