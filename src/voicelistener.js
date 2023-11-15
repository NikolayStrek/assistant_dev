export default function({ toggleButton, container, audioFileBlob, handleSendMessage }) {

    let isRecording = false;
    // let mediaRecorder;
    let audioChunks = [];
    let chunks = [];

    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {

            const mediaRecorder = new MediaRecorder(stream);

            toggleButton.current.addEventListener('click', function() {
                if (!isRecording) {
                    isRecording = true;
                    mediaRecorder.start();
                } else {
                    isRecording = false;
                    mediaRecorder.stop();
                }
            });

              mediaRecorder.onstop = (e) => {
                console.log("data available after MediaRecorder.stop() called.");
        
                const clipName = 'testRec';
        
                const clipContainer = document.createElement("article");
                const clipLabel = document.createElement("p");
                const audio = document.createElement("audio");
                const deleteButton = document.createElement("button");
        
                clipContainer.classList.add("clip");
                audio.setAttribute("controls", "");
                deleteButton.textContent = "Delete";
                clipLabel.textContent = clipName;
        
                clipContainer.appendChild(audio);
                clipContainer.appendChild(clipLabel);
                clipContainer.appendChild(deleteButton);

                container.current.appendChild(clipContainer);
        
                audio.controls = true;
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

                audioFileBlob.current = blob;

                chunks = [];
                const audioURL = URL.createObjectURL(blob);
                audio.src = audioURL;
                console.log("recorder stopped");
        
                deleteButton.onclick = (e) => {
                  const evtTgt = e.target;
                  evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                };

                handleSendMessage();
              };
        
              mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
              };

        })
        .catch(function(err) {
            console.error("Error accessing microphone: " + err);
        });



};